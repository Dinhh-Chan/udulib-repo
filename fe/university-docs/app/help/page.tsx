"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  HelpCircle,
  Search,
  BookOpen,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Video,
  Users,
  Star,
  Clock,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Lightbulb,
  Target,
  Zap,
  Shield
} from "lucide-react"

const helpCategories = [
  {
    id: "getting-started",
    title: "Bắt đầu sử dụng",
    icon: BookOpen,
    description: "Hướng dẫn cơ bản cho người mới",
    color: "bg-blue-500/10 text-blue-600 border-blue-200",
    items: [
      { title: "Đăng ký tài khoản", type: "guide", duration: "5 phút" },
      { title: "Tìm kiếm tài liệu đầu tiên", type: "guide", duration: "3 phút" },
      { title: "Tải lên tài liệu", type: "guide", duration: "10 phút" },
      { title: "Cài đặt hồ sơ cá nhân", type: "guide", duration: "5 phút" }
    ]
  },
  {
    id: "features",
    title: "Tính năng nâng cao",
    icon: Zap,
    description: "Khai thác tối đa các tính năng",
    color: "bg-purple-500/10 text-purple-600 border-purple-200",
    items: [
      { title: "Sử dụng bộ lọc nâng cao", type: "tutorial", duration: "8 phút" },
      { title: "Quản lý bộ sưu tập", type: "guide", duration: "6 phút" },
      { title: "Tham gia thảo luận", type: "tutorial", duration: "12 phút" },
      { title: "Chia sẻ tài liệu", type: "guide", duration: "4 phút" }
    ]
  },
  {
    id: "troubleshooting",
    title: "Khắc phục sự cố",
    icon: Shield,
    description: "Giải quyết các vấn đề thường gặp",
    color: "bg-red-500/10 text-red-600 border-red-200",
    items: [
      { title: "Không thể đăng nhập", type: "troubleshoot", duration: "2 phút" },
      { title: "Lỗi tải file", type: "troubleshoot", duration: "3 phút" },
      { title: "Trang tải chậm", type: "troubleshoot", duration: "4 phút" },
      { title: "Khôi phục mật khẩu", type: "troubleshoot", duration: "5 phút" }
    ]
  },
  {
    id: "account",
    title: "Quản lý tài khoản",
    icon: Users,
    description: "Cài đặt và bảo mật tài khoản",
    color: "bg-green-500/10 text-green-600 border-green-200",
    items: [
      { title: "Thay đổi mật khẩu", type: "guide", duration: "3 phút" },
      { title: "Cập nhật thông tin cá nhân", type: "guide", duration: "4 phút" },
      { title: "Cài đặt quyền riêng tư", type: "guide", duration: "6 phút" },
      { title: "Xóa tài khoản", type: "guide", duration: "2 phút" }
    ]
  }
]

const quickHelp = [
  {
    icon: Search,
    title: "Tìm kiếm nhanh",
    description: "Sử dụng từ khóa cụ thể và bộ lọc",
    action: "Thử ngay"
  },
  {
    icon: FileText,
    title: "Định dạng hỗ trợ",
    description: "PDF, DOC, PPT, XLS và nhiều hơn nữa",
    action: "Xem chi tiết"
  },
  {
    icon: MessageCircle,
    title: "Hỗ trợ trực tiếp",
    description: "Chat với đội ngũ hỗ trợ",
    action: "Bắt đầu chat"
  },
  {
    icon: Video,
    title: "Video hướng dẫn",
    description: "Học qua video trực quan",
    action: "Xem video"
  }
]

const contactOptions = [
  {
    icon: MessageCircle,
    title: "Chat trực tiếp",
    description: "Trò chuyện với nhân viên hỗ trợ",
    availability: "24/7",
    responseTime: "Ngay lập tức",
    status: "online"
  },
  {
    icon: Mail,
    title: "Email hỗ trợ",
    description: "Gửi câu hỏi chi tiết qua email",
    availability: "24/7",
    responseTime: "Trong 24 giờ",
    status: "available"
  },
  {
    icon: Phone,
    title: "Điện thoại",
    description: "Gọi điện trực tiếp cho hỗ trợ",
    availability: "8:00 - 17:00",
    responseTime: "Ngay lập tức",
    status: "limited"
  }
]

const popularGuides = [
  {
    title: "Hướng dẫn tải lên tài liệu hiệu quả",
    description: "Học cách tối ưu hóa việc tải lên và tổ chức tài liệu",
    rating: 4.8,
    views: "1,234",
    duration: "15 phút"
  },
  {
    title: "Tìm kiếm nâng cao với bộ lọc",
    description: "Sử dụng các bộ lọc để tìm tài liệu chính xác nhất",
    rating: 4.9,
    views: "2,156",
    duration: "12 phút"
  },
  {
    title: "Xây dựng hồ sơ học tập",
    description: "Tạo hồ sơ chuyên nghiệp và quản lý tài liệu cá nhân",
    rating: 4.7,
    views: "987",
    duration: "20 phút"
  }
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("getting-started")

  const filteredCategories = helpCategories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen py-8">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Trung tâm hỗ trợ
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tìm câu trả lời, hướng dẫn và nhận hỗ trợ để sử dụng UduLib hiệu quả nhất
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Tìm kiếm hướng dẫn, câu hỏi thường gặp..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 h-12 text-base"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-sm text-muted-foreground">Tìm kiếm phổ biến:</span>
                {["đăng nhập", "tải file", "quên mật khẩu", "tìm kiếm"].map((term) => (
                  <Button
                    key={term}
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery(term)}
                    className="h-7 text-xs"
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Help Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickHelp.map((item, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="mt-2">
                    {item.action}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            {helpCategories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center gap-2 px-2 py-2"
              >
                <category.icon className="h-4 w-4" />
                <span className="hidden sm:inline text-xs lg:text-sm">{category.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {helpCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-6">
              <Card className="overflow-hidden">
                <CardHeader className={`${category.color}`}>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-background/50 rounded-full">
                      <category.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{category.title}</CardTitle>
                      <CardDescription className="text-base">{category.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.items.map((item, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group cursor-pointer"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h4 className="font-medium">{item.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {item.type === 'guide' ? 'Hướng dẫn' : 
                               item.type === 'tutorial' ? 'Thực hành' : 'Khắc phục'}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {item.duration}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Popular Guides */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Hướng dẫn phổ biến
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularGuides.map((guide, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="font-semibold group-hover:text-primary transition-colors">
                          {guide.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">{guide.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{guide.rating}</span>
                          </div>
                          <span>{guide.views} lượt xem</span>
                          <span>{guide.duration}</span>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Support */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Liên hệ hỗ trợ</CardTitle>
                <CardDescription>
                  Chọn phương thức liên hệ phù hợp
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactOptions.map((option, index) => (
                  <div key={index} className="p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <option.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{option.title}</h4>
                          <div className={`w-2 h-2 rounded-full ${
                            option.status === 'online' ? 'bg-green-500' :
                            option.status === 'available' ? 'bg-blue-500' : 'bg-yellow-500'
                          }`}></div>
                        </div>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>Hoạt động: {option.availability}</div>
                          <div>Phản hồi: {option.responseTime}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-600" />
                  <CardTitle className="text-amber-800 dark:text-amber-200">Mẹo hữu ích</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-amber-700 dark:text-amber-300">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-3 w-3" />
                      <span className="font-medium">Tìm kiếm thông minh</span>
                    </div>
                    <p className="text-xs">Sử dụng dấu ngoặc kép cho cụm từ cụ thể</p>
                  </div>
                  <div className="text-sm text-amber-700 dark:text-amber-300">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-3 w-3" />
                      <span className="font-medium">Tối ưu tải file</span>
                    </div>
                    <p className="text-xs">Nén file trước khi tải lên để tăng tốc độ</p>
                  </div>
                  <div className="text-sm text-amber-700 dark:text-amber-300">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-3 w-3" />
                      <span className="font-medium">Sao lưu tài liệu</span>
                    </div>
                    <p className="text-xs">Luôn giữ bản sao tài liệu quan trọng</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center space-y-4 py-8">
          <h2 className="text-2xl font-bold">Vẫn cần hỗ trợ?</h2>
          <p className="text-muted-foreground">
            Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild>
              <a href="/contact">
                <MessageCircle className="h-4 w-4 mr-2" />
                Liên hệ hỗ trợ
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="/faq">
                <HelpCircle className="h-4 w-4 mr-2" />
                Xem FAQ
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="/feedback">
                <Target className="h-4 w-4 mr-2" />
                Gửi phản hồi
              </a>
            </Button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  )
} 