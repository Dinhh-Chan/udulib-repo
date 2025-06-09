import io
import logging
import tempfile
import os
import subprocess
from typing import Optional, Tuple, List
from PIL import Image, ImageDraw, ImageFont
import fitz  # PyMuPDF
from fastapi import HTTPException, status
from fastapi.responses import StreamingResponse

from app.services.minio_service import minio_service
from app.core.config import settings


class DocumentPreviewService:
    """Service để xử lý preview cho tất cả loại documents"""
    
    # Các loại file được hỗ trợ
    SUPPORTED_IMAGE_TYPES = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
    SUPPORTED_PDF_TYPES = ['.pdf']
    SUPPORTED_OFFICE_TYPES = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx']
    SUPPORTED_TEXT_TYPES = ['.txt', '.md', '.csv']
    
    # Kích thước preview
    MAX_PREVIEW_SIZE = (800, 600)
    THUMBNAIL_SIZE = (300, 300)
    LARGE_SIZE = (1200, 900)
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
    
    def get_file_type_category(self, filename: str) -> str:
        """Phân loại file theo category"""
        if not filename:
            self.logger.error("Filename is empty or None")
            return 'unsupported'
        
        try:
            ext = minio_service.get_file_extension(filename)
            
            # Nếu không có extension thì return unsupported
            if not ext:
                self.logger.info(f"File '{filename}' has no extension, treating as unsupported")
                return 'unsupported'
                
            self.logger.debug(f"File extension for '{filename}': '{ext}'")
        except Exception as e:
            self.logger.error(f"Error getting file extension for '{filename}': {e}")
            return 'unsupported'
        if ext.lower() in self.SUPPORTED_IMAGE_TYPES:
            return 'image'
        elif ext.lower() in self.SUPPORTED_PDF_TYPES:
            return 'pdf'
        elif ext.lower() in self.SUPPORTED_OFFICE_TYPES:
            return 'office'
        elif ext.lower() in self.SUPPORTED_TEXT_TYPES:
            return 'text'
        else:
            return 'unsupported'
    
    def is_supported_file(self, filename: str) -> bool:
        """Kiểm tra file có được hỗ trợ preview không"""
        return self.get_file_type_category(filename) != 'unsupported'
    
    def is_image_file(self, filename: str) -> bool:
        """Kiểm tra xem file có phải là hình ảnh không"""
        return self.get_file_type_category(filename) == 'image'
    
    def _convert_office_to_pdf(self, input_path: str) -> Optional[str]:
        """Chuyển đổi file Office sang PDF bằng LibreOffice"""
        try:
            # Tạo thư mục tạm cho output
            output_dir = tempfile.mkdtemp()
            
            # Command để chuyển đổi
            cmd = [
                'libreoffice', '--headless', '--convert-to', 'pdf',
                '--outdir', output_dir, input_path
            ]
            
            # Chạy command với timeout
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                # Tìm file PDF đã tạo
                base_name = os.path.splitext(os.path.basename(input_path))[0]
                pdf_path = os.path.join(output_dir, f"{base_name}.pdf")
                if os.path.exists(pdf_path):
                    return pdf_path
            
            self.logger.error(f"LibreOffice conversion failed: {result.stderr}")
            return None
            
        except subprocess.TimeoutExpired:
            self.logger.error("LibreOffice conversion timeout")
            return None
        except Exception as e:
            self.logger.error(f"LibreOffice conversion error: {e}")
            return None
    
    def _pdf_to_images(self, pdf_path: str, max_pages: int = 5) -> List[Image.Image]:
        """Chuyển PDF thành danh sách hình ảnh"""
        try:
            doc = fitz.open(pdf_path)
            images = []
            
            # Giới hạn số trang để preview
            num_pages = min(len(doc), max_pages)
            
            for page_num in range(num_pages):
                page = doc[page_num]
                # Render với độ phân giải cao
                mat = fitz.Matrix(2.0, 2.0)  # Scale 2x
                pix = page.get_pixmap(matrix=mat)
                img_data = pix.tobytes("png")
                img = Image.open(io.BytesIO(img_data))
                images.append(img)
            
            doc.close()
            return images
            
        except Exception as e:
            self.logger.error(f"Error converting PDF to images: {e}")
            return []
    
    def _create_text_preview_image(self, text_content: str, size: Tuple[int, int] = None, is_full_preview: bool = False) -> Image.Image:
        """Tạo hình ảnh preview từ nội dung text"""
        if size is None:
            size = self.MAX_PREVIEW_SIZE
        
        try:
            # Sử dụng font mặc định
            font = ImageFont.load_default()
        except:
            font = None
        
        # Chuẩn bị text dựa trên loại preview
        if is_full_preview:
            # Full preview: hiển thị nhiều nội dung hơn
            lines = text_content.split('\n')[:200]  # 200 dòng cho full preview
            max_chars = 10000  # 10k ký tự cho full preview
        else:
            # Thumbnail/normal preview: giới hạn như cũ
            lines = text_content.split('\n')[:30]  # 30 dòng
            max_chars = 1000  # 1k ký tự
        
        text_to_draw = '\n'.join(lines)
        
        if len(text_to_draw) > max_chars:
            text_to_draw = text_to_draw[:max_chars] + "..."
        
        # Tính toán chiều cao cần thiết cho text
        margin = 20
        line_height = 15  # Ước tính chiều cao mỗi dòng
        estimated_lines = len(text_to_draw.split('\n'))
        estimated_height = margin * 2 + estimated_lines * line_height
        
        # Điều chỉnh kích thước image cho full preview
        if is_full_preview and estimated_height > size[1]:
            # Tạo image cao hơn để chứa full text
            final_size = (size[0], max(estimated_height, size[1]))
        else:
            final_size = size
        
        # Tạo image
        img = Image.new('RGB', final_size, color='white')
        draw = ImageDraw.Draw(img)
        
        # Vẽ text lên image
        draw.text((margin, margin), text_to_draw, fill='black', font=font)
        
        return img
    
    def _resize_image(self, image: Image.Image, target_size: Tuple[int, int]) -> Image.Image:
        """Resize image giữ tỷ lệ khung hình"""
        # Tạo copy để không ảnh hưởng image gốc
        img_copy = image.copy()
        img_copy.thumbnail(target_size, Image.Resampling.LANCZOS)
        
        # Chuyển đổi về RGB nếu cần
        if img_copy.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img_copy.size, (255, 255, 255))
            if img_copy.mode == 'P':
                img_copy = img_copy.convert('RGBA')
            if img_copy.mode == 'RGBA':
                background.paste(img_copy, mask=img_copy.split()[-1])
            else:
                background.paste(img_copy)
            img_copy = background
        
        return img_copy

    def _create_multipage_preview(self, images: List[Image.Image], target_size: Optional[Tuple[int, int]] = None) -> Image.Image:
        """Tạo preview nhiều trang bằng cách ghép các trang thành 1 image dài"""
        if not images:
            raise ValueError("No images provided")
        
        # Xác định kích thước của mỗi trang
        if target_size:
            max_width = target_size[0]
        else:
            max_width = 800
        
        # Resize tất cả images về cùng width
        resized_images = []
        for img in images:
            # Chuyển về RGB nếu cần
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                if img.mode == 'RGBA':
                    background.paste(img, mask=img.split()[-1])
                else:
                    background.paste(img)
                img = background
            
            # Resize giữ tỷ lệ
            ratio = max_width / img.width
            new_height = int(img.height * ratio)
            resized_img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            resized_images.append(resized_img)
        
        # Tính tổng chiều cao
        total_height = sum(img.height for img in resized_images)
        
        # Thêm khoảng cách giữa các trang
        spacing = 20
        total_height += spacing * (len(resized_images) - 1)
        
        # Tạo canvas lớn
        combined_image = Image.new('RGB', (max_width, total_height), color='white')
        
        # Dán các trang vào canvas
        y_offset = 0
        for img in resized_images:
            combined_image.paste(img, (0, y_offset))
            y_offset += img.height + spacing
        
        return combined_image
    
    def get_document_preview_stream(self, file_path: str, filename: str, size_type: str = "medium") -> StreamingResponse:
        """
        Lấy preview stream cho bất kỳ loại tài liệu nào được hỗ trợ
        
        Args:
            file_path: Đường dẫn file trong MinIO
            filename: Tên file để xác định loại
            size_type: Loại kích thước (small, medium, large, original, full)
        """
        try:
            file_category = self.get_file_type_category(filename)
            
            if file_category == 'unsupported':
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Định dạng file không được hỗ trợ preview"
                )
            
            # Xác định kích thước target và số trang
            is_full_preview = size_type == "full"
            
            if size_type == "small":
                target_size = self.THUMBNAIL_SIZE
                max_pages = 1
            elif size_type == "large":
                target_size = self.LARGE_SIZE  
                max_pages = 5
            elif size_type == "original":
                target_size = None
                max_pages = 10
            elif size_type == "full":
                target_size = self.LARGE_SIZE
                max_pages = 50  # Nhiều trang cho full preview
            else:  # medium
                target_size = self.MAX_PREVIEW_SIZE
                max_pages = 3
            
            # Xử lý theo loại file
            if file_category == 'image':
                return self._handle_image_preview(file_path, target_size)
            elif file_category == 'pdf':
                return self._handle_pdf_preview(file_path, target_size, max_pages, is_full_preview)
            elif file_category == 'office':
                return self._handle_office_preview(file_path, target_size, max_pages, is_full_preview)
            elif file_category == 'text':
                return self._handle_text_preview(file_path, target_size, is_full_preview)
                
        except HTTPException:
            raise
        except Exception as e:
            self.logger.error(f"Error getting document preview: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Không thể tạo preview tài liệu"
            )
    
    def _handle_image_preview(self, file_path: str, target_size: Optional[Tuple[int, int]]) -> StreamingResponse:
        """Xử lý preview cho hình ảnh"""
        file_stream = minio_service.get_file_stream(file_path)
        if not file_stream:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File không tồn tại")
        
        image_data = file_stream.read()
        file_stream.close()
        
        if target_size is None:
            # Trả về original
            file_info = minio_service.get_file_info(file_path)
            content_type = file_info.get('content_type', 'image/jpeg') if file_info else 'image/jpeg'
            return StreamingResponse(
                io.BytesIO(image_data),
                media_type=content_type,
                headers={"Cache-Control": "public, max-age=3600", "Content-Disposition": "inline"}
            )
        
        # Resize image
        try:
            image = Image.open(io.BytesIO(image_data))
            resized_image = self._resize_image(image, target_size)
            
            output = io.BytesIO()
            resized_image.save(output, format='JPEG', quality=85, optimize=True)
            output.seek(0)
            
            return StreamingResponse(
                io.BytesIO(output.getvalue()),
                media_type="image/jpeg",
                headers={"Cache-Control": "public, max-age=3600", "Content-Disposition": "inline"}
            )
        except Exception as e:
            self.logger.error(f"Error processing image: {e}")
            # Fallback to original
            return StreamingResponse(
                io.BytesIO(image_data),
                media_type="image/jpeg",
                headers={"Content-Disposition": "inline"}
            )
    
    def _handle_pdf_preview(self, file_path: str, target_size: Optional[Tuple[int, int]], max_pages: int = 1, is_full_preview: bool = False) -> StreamingResponse:
        """Xử lý preview cho PDF"""
        file_stream = minio_service.get_file_stream(file_path)
        if not file_stream:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File không tồn tại")
        
        # Lưu PDF vào file tạm
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            for chunk in file_stream.stream(32*1024):
                temp_file.write(chunk)
            temp_pdf_path = temp_file.name
        
        file_stream.close()
        
        try:
            # Chuyển PDF thành images
            images = self._pdf_to_images(temp_pdf_path, max_pages=max_pages)
            
            if not images:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Không thể tạo preview từ PDF"
                )
            
            if is_full_preview and len(images) > 1:
                # Tạo multi-page preview - ghép các trang thành 1 image dài
                combined_image = self._create_multipage_preview(images, target_size)
                final_image = combined_image
            else:
                # Single page preview (thumbnail hoặc medium)
                final_image = images[0]
                
                if target_size:
                    final_image = self._resize_image(final_image, target_size)
            
            # Chuyển thành JPEG và return StreamingResponse
            output = io.BytesIO()
            final_image.save(output, format='JPEG', quality=85, optimize=True)
            output.seek(0)
            
            return StreamingResponse(
                io.BytesIO(output.getvalue()),
                media_type="image/jpeg",
                headers={"Cache-Control": "public, max-age=3600", "Content-Disposition": "inline"}
            )
            
        finally:
            # Xóa file tạm
            try:
                os.unlink(temp_pdf_path)
            except:
                pass
    
    def _handle_office_preview(self, file_path: str, target_size: Optional[Tuple[int, int]], max_pages: int = 1, is_full_preview: bool = False) -> StreamingResponse:
        """Xử lý preview cho Office documents"""
        file_stream = minio_service.get_file_stream(file_path)
        if not file_stream:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File không tồn tại")
        
        # Lưu file Office vào file tạm
        try:
            filename = file_path.split('/')[-1]
            file_ext = minio_service.get_file_extension(filename)
        except Exception as e:
            self.logger.error(f"Error getting file extension from path '{file_path}': {e}")
            file_ext = '.tmp'  # fallback extension
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as temp_file:
            for chunk in file_stream.stream(32*1024):
                temp_file.write(chunk)
            temp_office_path = temp_file.name
        
        file_stream.close()
        
        try:
            # Chuyển Office sang PDF
            pdf_path = self._convert_office_to_pdf(temp_office_path)
            
            if not pdf_path:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Không thể chuyển đổi file Office. Vui lòng kiểm tra LibreOffice đã được cài đặt."
                )
            
            try:
                # Chuyển PDF thành images
                images = self._pdf_to_images(pdf_path, max_pages=max_pages)
                
                if not images:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Không thể tạo preview từ file Office"
                    )
                
                if is_full_preview and len(images) > 1:
                    # Multi-page preview cho Office documents
                    combined_image = self._create_multipage_preview(images, target_size)
                    final_image = combined_image
                else:
                    # Single page preview
                    final_image = images[0]
                    
                    if target_size:
                        final_image = self._resize_image(final_image, target_size)
                
                # Chuyển thành JPEG và return StreamingResponse
                output = io.BytesIO()
                final_image.save(output, format='JPEG', quality=85, optimize=True)
                output.seek(0)
                
                return StreamingResponse(
                    io.BytesIO(output.getvalue()),
                    media_type="image/jpeg",
                    headers={"Cache-Control": "public, max-age=3600", "Content-Disposition": "inline"}
                )
                
            finally:
                # Xóa PDF tạm
                try:
                    os.unlink(pdf_path)
                except:
                    pass
                    
        finally:
            # Xóa file Office tạm
            try:
                os.unlink(temp_office_path)
            except:
                pass
    
    def _handle_text_preview(self, file_path: str, target_size: Optional[Tuple[int, int]], is_full_preview: bool = False) -> StreamingResponse:
        """Xử lý preview cho text files"""
        file_stream = minio_service.get_file_stream(file_path)
        if not file_stream:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File không tồn tại")
        
        # Đọc nội dung text
        text_data = file_stream.read()
        file_stream.close()
        
        try:
            # Decode text (thử các encoding phổ biến)
            text_content = None
            for encoding in ['utf-8', 'utf-16', 'latin1', 'cp1252']:
                try:
                    text_content = text_data.decode(encoding)
                    break
                except:
                    continue
            
            if text_content is None:
                text_content = "Không thể đọc nội dung file text"
            
            # Tạo image từ text
            preview_size = target_size or self.MAX_PREVIEW_SIZE
            text_image = self._create_text_preview_image(text_content, preview_size, is_full_preview)
            
            output = io.BytesIO()
            text_image.save(output, format='JPEG', quality=85, optimize=True)
            output.seek(0)
            
            return StreamingResponse(
                io.BytesIO(output.getvalue()),
                media_type="image/jpeg",
                headers={"Cache-Control": "public, max-age=3600", "Content-Disposition": "inline"}
            )
            
        except Exception as e:
            self.logger.error(f"Error processing text file: {e}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Không thể tạo preview từ file text"
            )
    
    # Backwards compatibility methods
    def get_image_preview_stream(self, file_path: str, max_size: Optional[Tuple[int, int]] = None) -> StreamingResponse:
        """Backwards compatibility cho image preview"""
        filename = file_path.split('/')[-1]
        size_type = "medium"
        if max_size == self.THUMBNAIL_SIZE:
            size_type = "small"
        elif max_size == self.LARGE_SIZE:
            size_type = "large"
        return self.get_document_preview_stream(file_path, filename, size_type)
    
    def get_thumbnail_stream(self, file_path: str) -> StreamingResponse:
        """Backwards compatibility cho thumbnail"""
        filename = file_path.split('/')[-1]
        return self.get_document_preview_stream(file_path, filename, "small")
    
    def get_original_image_stream(self, file_path: str) -> StreamingResponse:
        """Backwards compatibility cho original image"""
        filename = file_path.split('/')[-1]
        return self.get_document_preview_stream(file_path, filename, "original")


document_preview_service = DocumentPreviewService() 