import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
from typing import Optional

from app.core.config import settings

logger = logging.getLogger(__name__)


class EmailService:
    def __init__(self):
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_user = settings.SMTP_USER
        self.smtp_password = settings.SMTP_PASSWORD
        self.from_email = settings.EMAILS_FROM_EMAIL
        self.from_name = settings.EMAILS_FROM_NAME

    async def send_password_reset_email(self, to_email: str, new_password: str, user_name: str = None) -> bool:
        """
        Gửi email chứa mật khẩu mới
        """
        try:
            subject = "Mật khẩu mới - Thư viện UDU"
            
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Mật khẩu mới</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2c3e50;">Mật khẩu mới của bạn</h2>
                    <p>Xin chào {user_name or 'bạn'},</p>
                    <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản tại Thư viện UDU.</p>
                    <p>Dưới đây là mật khẩu mới của bạn:</p>
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
                        <strong style="font-size: 18px; color: #2c3e50;">{new_password}</strong>
                    </div>
                    <p><strong>Lưu ý quan trọng:</strong></p>
                    <ul>
                        <li>Vui lòng đăng nhập ngay với mật khẩu mới này</li>
                        <li>Để bảo mật tài khoản, bạn nên đổi mật khẩu sau khi đăng nhập</li>
                        <li>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng liên hệ với chúng tôi ngay lập tức</li>
                    </ul>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="font-size: 12px; color: #666;">
                        Email này được gửi từ hệ thống Thư viện UDU.<br>
                        Vui lòng không trả lời email này.
                    </p>
                </div>
            </body>
            </html>
            """
            
            # Tạo message
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = f"{self.from_name} <{self.from_email}>"
            message["To"] = to_email
            
            # Thêm HTML content
            html_part = MIMEText(html_content, "html", "utf-8")
            message.attach(html_part)
            
            # Gửi email
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.send_message(message)
                
            return True
            
        except Exception as e:
            logger.error(f"Lỗi khi gửi email đặt lại mật khẩu: {str(e)}")
            return False

    async def send_password_changed_notification(self, to_email: str, user_name: str = None) -> bool:
        """
        Gửi email thông báo mật khẩu đã được thay đổi thành công
        """
        try:
            subject = "Mật khẩu đã được thay đổi - Thư viện UDU"
            
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Mật khẩu đã thay đổi</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #27ae60;">Mật khẩu đã được thay đổi thành công</h2>
                    <p>Xin chào {user_name or 'bạn'},</p>
                    <p>Mật khẩu của bạn đã được thay đổi thành công vào lúc: <strong>{self._get_current_time()}</strong></p>
                    <p>Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ với chúng tôi ngay lập tức.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="font-size: 12px; color: #666;">
                        Email này được gửi từ hệ thống Thư viện UDU.<br>
                        Vui lòng không trả lời email này.
                    </p>
                </div>
            </body>
            </html>
            """
            
            # Tạo message
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = f"{self.from_name} <{self.from_email}>"
            message["To"] = to_email
            
            # Thêm HTML content
            html_part = MIMEText(html_content, "html", "utf-8")
            message.attach(html_part)
            
            # Gửi email
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.send_message(message)
                
            return True
            
        except Exception as e:
            return False

    def _get_current_time(self) -> str:
        """Lấy thời gian hiện tại định dạng người dùng có thể đọc"""
        from datetime import datetime
        return datetime.now().strftime("%d/%m/%Y %H:%M:%S")


# Tạo instance global để sử dụng
email_service = EmailService() 