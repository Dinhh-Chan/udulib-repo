"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search,
  HelpCircle,
  BookOpen,
  Upload,
  Download,
  User,
  Shield,
  MessageCircle,
  Settings,
  AlertCircle,
  CheckCircle,
  Lightbulb
} from "lucide-react"

const faqCategories = [
  {
    id: "general",
    title: "Câu hỏi chung",
    icon: HelpCircle,
    color: "bg-blue-500/10 text-blue-600 border-blue-200"
  },
  {
    id: "account",
    title: "Tài khoản",
    icon: User,
    color: "bg-green-500/10 text-green-600 border-green-200"
  },
  {
    id: "documents",
    title: "Tài liệu",
    icon: BookOpen,
    color: "bg-purple-500/10 text-purple-600 border-purple-200"
  },
  {
    id: "technical",
    title: "Kỹ thuật",
    icon: Settings,
    color: "bg-orange-500/10 text-orange-600 border-orange-200"
  }
]

const faqs = [
  {
    category: "general",
    question: "UduLib là gì và được sử dụng như thế nào?",
    answer: "UduLib là hệ thống quản lý tài liệu học tập dành cho sinh viên và giảng viên. Bạn có thể tìm kiếm, tải xuống, chia sẻ tài liệu học tập, tham gia thảo luận và xây dựng cộng đồng học tập trực tuyến."
  },
  {
    category: "general",
    question: "Ai có thể sử dụng UduLib?",
    answer: "UduLib được thiết kế cho sinh viên, giảng viên, và nhân viên của trường đại học. Bạn cần có email của trường để đăng ký tài khoản."
  },
  {
    category: "general",
    question: "UduLib có miễn phí không?",
    answer: "Có, UduLib hoàn toàn miễn phí cho tất cả thành viên của trường đại học. Chúng tôi cam kết cung cấp dịch vụ chất lượng cao mà không thu phí."
  },
  {
    category: "account",
    question: "Làm thế nào để đăng ký tài khoản?",
    answer: "Bạn cần sử dụng email của trường để đăng ký. Sau khi điền thông tin, chúng tôi sẽ gửi email xác thực. Nhấp vào link trong email để kích hoạt tài khoản."
  },
  {
    category: "account",
    question: "Tôi quên mật khẩu, phải làm sao?",
    answer: "Nhấp vào 'Quên mật khẩu' ở trang đăng nhập, nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu qua email."
  },
  {
    category: "account",
    question: "Làm thế nào để thay đổi thông tin cá nhân?",
    answer: "Sau khi đăng nhập, vào mục 'Hồ sơ' từ menu tài khoản. Tại đây bạn có thể cập nhật thông tin cá nhân, ảnh đại diện và các thiết lập khác."
  },
  {
    category: "documents",
    question: "Định dạng file nào được hỗ trợ?",
    answer: "Chúng tôi hỗ trợ các định dạng phổ biến như PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX. Kích thước tối đa cho mỗi file là 50MB."
  },
  {
    category: "documents",
    question: "Làm thế nào để tải lên tài liệu?",
    answer: "Nhấp vào nút 'Tải lên' trên thanh navigation, chọn ngành học và môn học, sau đó kéo thả file hoặc nhấp để chọn file từ máy tính của bạn."
  },
  {
    category: "documents",
    question: "Tài liệu của tôi có được bảo mật không?",
    answer: "Tất cả tài liệu được mã hóa và lưu trữ an toàn. Bạn có thể chọn chia sẻ công khai hoặc chỉ với nhóm cụ thể. Chúng tôi tôn trọng quyền riêng tư của bạn."
  },
  {
    category: "documents",
    question: "Làm thế nào để tìm kiếm tài liệu hiệu quả?",
    answer: "Sử dụng từ khóa cụ thể, kết hợp với bộ lọc theo ngành học, môn học, loại tài liệu. Bạn cũng có thể sắp xếp theo độ phổ biến, ngày tải lên, hoặc đánh giá."
  },
  {
    category: "technical",
    question: "Tại sao trang web tải chậm?",
    answer: "Điều này có thể do kết nối internet hoặc nhiều người dùng cùng lúc. Hãy thử làm mới trang, kiểm tra kết nối mạng, hoặc liên hệ với chúng tôi nếu vấn đề vẫn tiếp tục."
  },
  {
    category: "technical",
    question: "UduLib có ứng dụng di động không?",
    answer: "Hiện tại chúng tôi chưa có ứng dụng riêng, nhưng website được tối ưu hóa cho mobile. Bạn có thể truy cập dễ dàng từ trình duyệt trên điện thoại."
  },
  {
    category: "technical",
    question: "Làm thế nào để báo cáo lỗi hoặc góp ý?",
    answer: "Bạn có thể sử dụng trang 'Feedback' hoặc 'Liên hệ' để gửi báo cáo lỗi, góp ý cải thiện. Chúng tôi luôn lắng nghe và cải thiện dựa trên phản hồi của người dùng."
  }
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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
            Câu hỏi thường gặp
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tìm câu trả lời nhanh chóng cho các thắc mắc phổ biến về UduLib
          </p>
        </div>

        {/* Search Section */}
        <Card className="max-w-md mx-auto">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Tìm kiếm câu hỏi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            className="flex items-center gap-2"
          >
            <HelpCircle className="h-4 w-4" />
            Tất cả
          </Button>
          {faqCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              <category.icon className="h-4 w-4" />
              {category.title}
            </Button>
          ))}
        </div>

        {/* FAQ Categories Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {faqCategories.map((category) => {
            const categoryCount = faqs.filter(faq => faq.category === category.id).length
            return (
              <Card 
                key={category.id}
                className={`group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${category.color}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 bg-background/50 rounded-full">
                      <category.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold">{category.title}</h3>
                    <Badge variant="secondary">{categoryCount} câu hỏi</Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* FAQ Content */}
        <div className="space-y-6">
          {filteredFAQs.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFAQs.map((faq, index) => {
                const category = faqCategories.find(cat => cat.id === faq.category)
                return (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <Card className="group hover:shadow-md transition-all duration-300">
                      <AccordionTrigger className="px-6 py-4 hover:no-underline">
                        <div className="flex items-start gap-4 text-left">
                          <div className={`p-2 rounded-lg ${category?.color} flex-shrink-0`}>
                            {category && <category.icon className="h-4 w-4" />}
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {faq.question}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {category?.title}
                            </Badge>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <div className="ml-12 p-4 bg-muted/30 rounded-lg">
                          <p className="text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </AccordionContent>
                    </Card>
                  </AccordionItem>
                )
              })}
            </Accordion>
          ) : (
            <Card className="text-center py-8">
              <CardContent>
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Không tìm thấy câu hỏi nào</h3>
                <p className="text-muted-foreground mb-4">
                  Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác
                </p>
                <Button onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                }}>
                  Xóa bộ lọc
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Help Section */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-blue-800 dark:text-blue-200">Vẫn cần hỗ trợ?</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center space-y-2">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full w-fit mx-auto">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-200">Hướng dẫn chi tiết</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  Xem hướng dẫn từng bước sử dụng hệ thống
                </p>
                <Button asChild variant="outline" size="sm">
                  <a href="/guide">Xem hướng dẫn</a>
                </Button>
              </div>
              <div className="text-center space-y-2">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full w-fit mx-auto">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-200">Liên hệ hỗ trợ</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  Gửi câu hỏi trực tiếp cho đội ngũ hỗ trợ
                </p>
                <Button asChild variant="outline" size="sm">
                  <a href="/contact">Liên hệ ngay</a>
                </Button>
              </div>
              <div className="text-center space-y-2">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full w-fit mx-auto">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-200">Góp ý cải thiện</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  Chia sẻ ý kiến để chúng tôi cải thiện
                </p>
                <Button asChild variant="outline" size="sm">
                  <a href="/feedback">Gửi góp ý</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
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