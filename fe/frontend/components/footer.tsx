import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t py-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Thư viện Tài liệu</h3>
            <p className="text-muted-foreground">
              Hệ thống lưu trữ và quản lý tài liệu học tập cho các ngành học của trường đại học.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Liên kết</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/departments" className="text-muted-foreground hover:text-foreground">
                  Ngành học
                </Link>
              </li>
              <li>
                <Link href="/documents" className="text-muted-foreground hover:text-foreground">
                  Tài liệu
                </Link>
              </li>
              <li>
                <Link href="/forum" className="text-muted-foreground hover:text-foreground">
                  Diễn đàn
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Liên hệ</h3>
            <address className="not-italic text-muted-foreground">
              <p>Trường Đại học ABC</p>
              <p>123 Đường XYZ, Quận/Huyện, Tỉnh/Thành phố</p>
              <p>Email: contact@example.edu.vn</p>
              <p>Điện thoại: (012) 345-6789</p>
            </address>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Thư viện Tài liệu. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}
