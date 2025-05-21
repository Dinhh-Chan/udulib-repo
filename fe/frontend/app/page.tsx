import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Link from "next/link"
import FeaturedDepartments from "@/components/featured-departments"
import RecentDocuments from "@/components/recent-documents"
import HeroSection from "@/components/hero-section"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />

      {/* Tìm kiếm */}
      <div className="my-8">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Tìm kiếm tài liệu, môn học, ngành học..." className="pl-10 h-12" />
          <Button className="absolute right-1 top-1/2 -translate-y-1/2 h-10">Tìm kiếm</Button>
        </div>
      </div>

      {/* Ngành học nổi bật */}
      <section className="my-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Ngành học</h2>
          <Link href="/departments" className="text-primary hover:underline">
            Xem tất cả
          </Link>
        </div>
        <FeaturedDepartments />
      </section>

      {/* Tài liệu mới nhất */}
      <section className="my-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Tài liệu mới nhất</h2>
          <Link href="/documents" className="text-primary hover:underline">
            Xem tất cả
          </Link>
        </div>
        <RecentDocuments />
      </section>

      {/* Thống kê */}
      <section className="my-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl font-bold text-center">1,234</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">Tài liệu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl font-bold text-center">15</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">Ngành học</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl font-bold text-center">5,678</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">Người dùng</p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
