"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  Upload, 
  Search, 
  MessageCircle, 
  Settings, 
  User,
  FileText,
  Download,
  Star,
  Share2,
  ChevronRight,
  Lightbulb
} from "lucide-react"

const guideSteps = [
  {
    id: "getting-started",
    title: "Bắt đầu sử dụng",
    icon: BookOpen,
    description: "Hướng dẫn cơ bản cho người mới bắt đầu",
    steps: [
      "Đăng ký tài khoản với email của trường",
      "Xác thực email và hoàn thiện hồ sơ cá nhân",
      "Khám phá các ngành học và tài liệu có sẵn",
      "Tìm hiểu cách sử dụng bộ lọc và tìm kiếm"
    ]
  },
  {
    id: "document-management",
    title: "Quản lý tài liệu",
    icon: FileText,
    description: "Cách tải lên, tải xuống và quản lý tài liệu",
    steps: [
      "Chọn ngành học và môn học phù hợp",
      "Tải lên tài liệu với định dạng PDF, DOC, PPT",
      "Thêm mô tả chi tiết và từ khóa",
      "Quản lý tài liệu đã tải lên trong hồ sơ"
    ]
  },
  {
    id: "search-tips",
    title: "Tìm kiếm hiệu quả",
    icon: Search,
    description: "Mẹo tìm kiếm tài liệu nhanh và chính xác",
    steps: [
      "Sử dụng từ khóa cụ thể và ngắn gọn",
      "Kết hợp bộ lọc theo ngành học và môn học",
      "Sử dụng dấu ngoặc kép cho cụm từ cụ thể",
      "Lưu tìm kiếm thường dùng để sử dụng sau"
    ]
  },
  {
    id: "community",
    title: "Tham gia cộng đồng",
    icon: MessageCircle,
    description: "Cách tương tác và thảo luận với cộng đồng",
    steps: [
      "Tham gia các cuộc thảo luận theo chủ đề",
      "Đặt câu hỏi và trả lời câu hỏi của người khác",
      "Đánh giá và bình luận tài liệu",
      "Theo dõi các chủ đề quan tâm"
    ]
  }
]

const tips = [
  {
    title: "Tối ưu hóa tìm kiếm",
    description: "Sử dụng từ khóa tiếng Việt có dấu để có kết quả chính xác hơn",
    icon: Search
  },
  {
    title: "Tải lên hiệu quả",
    description: "Nén file và đặt tên rõ ràng trước khi tải lên",
    icon: Upload
  },
  {
    title: "Bảo mật tài khoản",
    description: "Sử dụng mật khẩu mạnh và cập nhật thông tin thường xuyên",
    icon: Settings
  },
  {
    title: "Chia sẻ tài liệu",
    description: "Chia sẻ link trực tiếp thay vì tải xuống rồi gửi",
    icon: Share2
  }
]

export default function GuidePage() {
  const [activeStep, setActiveStep] = useState("getting-started")

  return (
    <div className="min-h-screen py-8">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Hướng dẫn sử dụng UduLib
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Khám phá tất cả tính năng và tận dụng tối đa hệ thống quản lý tài liệu học tập
          </p>
        </div>

        {/* Quick Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {tips.map((tip, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-primary/20 hover:border-l-primary">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <tip.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm">{tip.title}</h3>
                    <p className="text-xs text-muted-foreground">{tip.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Guide Content */}
        <Tabs value={activeStep} onValueChange={setActiveStep} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            {guideSteps.map((step) => (
              <TabsTrigger 
                key={step.id} 
                value={step.id}
                className="flex items-center gap-2 px-2 py-2"
              >
                <step.icon className="h-4 w-4" />
                <span className="hidden sm:inline text-xs lg:text-sm">{step.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {guideSteps.map((step) => (
            <TabsContent key={step.id} value={step.id} className="space-y-6">
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-blue-500/5">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{step.title}</CardTitle>
                      <CardDescription className="text-base">{step.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {step.steps.map((stepDescription, index) => (
                      <div 
                        key={index}
                        className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          {index + 1}
                        </div>
                        <div className="space-y-2">
                          <p className="font-medium text-foreground">{stepDescription}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors ml-auto" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Additional Resources */}
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-amber-800 dark:text-amber-200">Mẹo hữu ích</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-amber-800 dark:text-amber-200">Tối ưu trải nghiệm</h4>
                <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
                  <li>• Đặt bookmark các tài liệu quan trọng</li>
                  <li>• Sử dụng chế độ tối để bảo vệ mắt</li>
                  <li>• Bật thông báo để không bỏ lỡ cập nhật</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-amber-800 dark:text-amber-200">Quy tắc cộng đồng</h4>
                <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
                  <li>• Tôn trọng bản quyền tài liệu</li>
                  <li>• Chia sẻ tài liệu chất lượng cao</li>
                  <li>• Hỗ trợ và giúp đỡ lẫn nhau</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center space-y-4 py-8">
          <h2 className="text-2xl font-bold">Cần hỗ trợ thêm?</h2>
          <p className="text-muted-foreground">
            Nếu bạn vẫn có câu hỏi, đừng ngại liên hệ với chúng tôi
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild variant="outline">
              <a href="/faq">
                <MessageCircle className="h-4 w-4 mr-2" />
                Câu hỏi thường gặp
              </a>
            </Button>
            <Button asChild>
              <a href="/contact">
                <User className="h-4 w-4 mr-2" />
                Liên hệ hỗ trợ
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