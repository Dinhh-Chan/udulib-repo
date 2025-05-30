import Link from "next/link"
import { BookOpen } from "lucide-react"

export default function Footer() {
  return (
    <>
      <footer className="w-full border-t bg-background py-6">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1400px]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col items-center md:items-start gap-2">
              <Link href="/" className="flex items-center gap-2 font-bold">
                <BookOpen className="h-5 w-5" />
                <span>UduLib</span>
              </Link>
              <p className="text-sm text-muted-foreground text-center md:text-left">
                Hệ thống quản lý tài liệu học tập dành cho sinh viên và giảng viên
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-medium">Liên kết</h3>
                <div className="flex flex-col gap-1">
                  <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                    Trang chủ
                  </Link>
                  <Link href="/departments" className="text-sm text-muted-foreground hover:text-primary">
                    Ngành học
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-medium">Hỗ trợ</h3>
                <div className="flex flex-col gap-1">
                  <Link href="/guide" className="text-sm text-muted-foreground hover:text-primary">
                    Hướng dẫn sử dụng
                  </Link>
                  <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary">
                    Câu hỏi thường gặp
                  </Link>
                  <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
                    Liên hệ
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-medium">Pháp lý</h3>
                <div className="flex flex-col gap-1">
                  <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                    Điều khoản sử dụng
                  </Link>
                  <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                    Chính sách bảo mật
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="w-full py-3 border-t">
        <p className="text-xs text-center text-gray-500">
          © {new Date().getFullYear()} UduLib. Bản quyền thuộc về IU CLUB - PTIT.
        </p>
      </div>
    </>
  )
}
