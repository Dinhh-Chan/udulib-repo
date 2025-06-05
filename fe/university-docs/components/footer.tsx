"use client"
import Link from "next/link"
import { BookOpen, Mail, Phone, MapPin } from "lucide-react"
import { useState, useEffect } from "react"

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <footer className="mt-auto w-full border-t bg-background">
      {/* Main footer content */}
      <div className="py-6 sm:py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Brand section */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1 flex flex-col items-center md:items-start gap-3 sm:gap-4">
              <Link href="/" className="flex items-center gap-2 font-bold text-lg sm:text-xl hover:text-primary transition-colors">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
                <span>UduLib</span>
              </Link>
              <p className="text-sm sm:text-base text-muted-foreground text-center md:text-left max-w-xs leading-relaxed">
                Hệ thống quản lý tài liệu học tập dành cho sinh viên và giảng viên
              </p>
              
              {/* Contact info */}
              <div className="flex flex-col gap-2 text-sm text-muted-foreground items-center md:items-start">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>support@udulib.edu.vn</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>024 1234 5678</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Học viện PTIT, Hà Nội</span>
                </div>
              </div>
            </div>
            
            {/* Quick Links section */}
            <div className="flex flex-col gap-3 sm:gap-4 items-center md:items-start">
              <h3 className="text-sm sm:text-base font-semibold">Liên kết nhanh</h3>
              <div className="flex flex-col gap-2 items-center md:items-start">
                <Link href="/" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">
                  Trang chủ
                </Link>
                <Link href="/departments" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">
                  Ngành học
                </Link>
                <Link href="/documents" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">
                  Tài liệu
                </Link>
                <Link href="/forum" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">
                  Diễn đàn
                </Link>
                <Link href="/upload" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">
                  Tải lên tài liệu
                </Link>
              </div>
            </div>
            
            {/* Support section */}
            <div className="flex flex-col gap-3 sm:gap-4 items-center md:items-start">
              <h3 className="text-sm sm:text-base font-semibold">Hỗ trợ</h3>
              <div className="flex flex-col gap-2 items-center md:items-start">
                <Link href="/guide" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">
                  Hướng dẫn sử dụng
                </Link>
                <Link href="/faq" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">
                  Câu hỏi thường gặp
                </Link>
                <Link href="/contact" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">
                  Liên hệ
                </Link>
                <Link href="/feedback" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">
                  Góp ý
                </Link>
                <Link href="/help" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">
                  Trợ giúp
                </Link>
              </div>
            </div>
            
            {/* Legal section */}
            <div className="flex flex-col gap-3 sm:gap-4 items-center md:items-start">
              <h3 className="text-sm sm:text-base font-semibold">Pháp lý</h3>
              <div className="flex flex-col gap-2 items-center md:items-start">
                <Link href="/terms" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">
                  Điều khoản sử dụng
                </Link>
                <Link href="/privacy" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">
                  Chính sách bảo mật
                </Link>
                <Link href="/copyright" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">
                  Bản quyền
                </Link>
                <Link href="/cookies" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">
                  Chính sách cookie
                </Link>
              </div>
            </div>
          </div>
          
          {/* Divider */}
          <div className="border-t mt-8 sm:mt-12 pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                © {new Date().getFullYear()} UduLib. Bản quyền thuộc về IU CLUB - PTIT. Tất cả quyền được bảo lưu.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Phiên bản 1.0.0
                </span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Hệ thống hoạt động
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
