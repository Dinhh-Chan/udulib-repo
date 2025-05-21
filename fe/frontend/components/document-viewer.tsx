"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from "lucide-react"

interface DocumentViewerProps {
  fileType: string
  fileUrl: string
}

export default function DocumentViewer({ fileType, fileUrl }: DocumentViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(10) // Giả định có 10 trang
  const [zoom, setZoom] = useState(100)

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleZoomIn = () => {
    if (zoom < 200) {
      setZoom(zoom + 25)
    }
  }

  const handleZoomOut = () => {
    if (zoom > 50) {
      setZoom(zoom - 25)
    }
  }

  return (
    <div className="flex flex-col">
      {/* Thanh công cụ */}
      <div className="bg-muted p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handlePrevPage} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Trang {currentPage} / {totalPages}
          </span>
          <Button variant="ghost" size="icon" onClick={handleNextPage} disabled={currentPage === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={zoom <= 50}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm">{zoom}%</span>
          <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={zoom >= 200}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Nội dung tài liệu */}
      <div className="bg-background p-8 min-h-[500px] flex items-center justify-center">
        {fileType === "PDF" ? (
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="bg-white shadow-lg p-8 w-full max-w-2xl aspect-[3/4]"
              style={{ transform: `scale(${zoom / 100})` }}
            >
              <div className="text-center text-muted-foreground">
                Xem trước tài liệu PDF
                <p className="mt-4">
                  Trang {currentPage} / {totalPages}
                </p>
                <div className="mt-8 border-t pt-4">
                  <p className="font-bold">Giáo trình HTML, CSS cơ bản</p>
                  <p className="mt-4">
                    Nội dung mẫu của tài liệu sẽ hiển thị ở đây. Trong môi trường thực tế, đây sẽ là nội dung thực của
                    tài liệu PDF.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : fileType === "DOCX" ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="bg-white shadow-lg p-8 w-full max-w-2xl" style={{ transform: `scale(${zoom / 100})` }}>
              <div className="text-center text-muted-foreground">
                Xem trước tài liệu DOCX
                <p className="mt-4">
                  Trang {currentPage} / {totalPages}
                </p>
                <div className="mt-8 border-t pt-4 text-left">
                  <p className="font-bold text-center">Bài tập JavaScript</p>
                  <p className="mt-4">
                    Nội dung mẫu của tài liệu sẽ hiển thị ở đây. Trong môi trường thực tế, đây sẽ là nội dung thực của
                    tài liệu DOCX.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : fileType === "PPTX" ? (
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="bg-white shadow-lg p-8 w-full max-w-2xl aspect-[16/9]"
              style={{ transform: `scale(${zoom / 100})` }}
            >
              <div className="text-center text-muted-foreground">
                Xem trước tài liệu PPTX
                <p className="mt-4">
                  Slide {currentPage} / {totalPages}
                </p>
                <div className="mt-8 border-t pt-4">
                  <p className="font-bold">Slide bài giảng ReactJS</p>
                  <p className="mt-4">
                    Nội dung mẫu của tài liệu sẽ hiển thị ở đây. Trong môi trường thực tế, đây sẽ là nội dung thực của
                    tài liệu PPTX.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">Không hỗ trợ xem trước định dạng {fileType}</div>
        )}
      </div>
    </div>
  )
}
