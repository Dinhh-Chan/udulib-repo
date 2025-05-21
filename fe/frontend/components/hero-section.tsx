import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HeroSection() {
  return (
    <div className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 -z-10" />
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Thư viện tài liệu học tập</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Kho lưu trữ tài liệu học tập đa dạng cho sinh viên và giảng viên. Dễ dàng tìm kiếm, chia sẻ và quản lý tài
            liệu theo ngành học và môn học.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/documents">Khám phá tài liệu</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/upload">Tải lên tài liệu</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
