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

    async def send_password_reset_email(self, to_email: str, reset_token: str, user_name: str = None) -> bool:
        """
        Gửi email xác nhận đổi mật khẩu
        """
        try:
            # Tạo reset link
            reset_link = f"{settings.SERVER_HOST}/reset-password?token={reset_token}"
            
            # Tạo nội dung email
            subject = "Xác nhận đổi mật khẩu - Thư viện UDU"
            
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Đổi mật khẩu</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2c3e50;">Xác nhận đổi mật khẩu</h2>
                    <p>Xin chào {user_name or 'bạn'},</p>
                    <p>Bạn đã yêu cầu đổi mật khẩu cho tài khoản tại Thư viện UDU.</p>
                    <p>Vui lòng nhấp vào liên kết bên dưới để xác nhận và đặt mật khẩu mới:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{reset_link}" 
                           style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Đổi mật khẩu
                        </a>
                    </div>
                    <p><strong>Lưu ý:</strong> Liên kết này sẽ hết hạn sau {settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES} phút.</p>
                    <p>Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này.</p>
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