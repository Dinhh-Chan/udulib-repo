import { Link } from "react-router-dom"
import { BookOpen } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background py-6">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <BookOpen className="h-5 w-5" />
            <span>EduDocs</span>
          </Link>
          <p className="text-sm text-muted-foreground text-center md:text-left">
            Hệ thống quản lý tài liệu học tập dành cho sinh viên và giảng viên
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Liên kết</h3>
            <div className="flex flex-col gap-1">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
                Trang chủ
              </Link>
              <Link to="/departments" className="text-sm text-muted-foreground hover:text-primary">
                Ngành học
              </Link>
              <Link to="/documents/recent" className="text-sm text-muted-foreground hover:text-primary">
                Tài liệu mới
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Hỗ trợ</h3>
            <div className="flex flex-col gap-1">
              <Link to="/guide" className="text-sm text-muted-foreground hover:text-primary">
                Hướng dẫn sử dụng
              </Link>
              <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary">
                Câu hỏi thường gặp
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">
                Liên hệ
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Pháp lý</h3>
            <div className="flex flex-col gap-1">
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">
                Điều khoản sử dụng
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                Chính sách bảo mật
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-6 pt-4 border-t">
        <p className="text-xs text-center text-muted-foreground">
          © {new Date().getFullYear()} EduDocs. Bản quyền thuộc về Trường Đại học.
        </p>
      </div>
    </footer>
  )
}
