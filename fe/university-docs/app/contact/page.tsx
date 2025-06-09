"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  User,
  HelpCircle,
  Bug,
  Lightbulb,
  Star,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { toast } from "sonner"

const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    description: "Gửi email cho chúng tôi",
    contact: "thuvienudu@gmail.com",
    action: "mailto:thuvienudu@gmail.com"
  },
  {
    icon: Phone,
    title: "Điện thoại",
    description: "Gọi điện trực tiếp",
    contact: "+84 123 456 789",
    action: "tel:+84123456789"
  },
  {
    icon: MapPin,
    title: "Địa chỉ",
    description: "Đến trực tiếp văn phòng",
    contact: "122, Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
    action: null
  },
  {
    icon: Clock,
    title: "Giờ làm việc",
    description: "Thời gian hỗ trợ",
    contact: "Thứ 2 - Thứ 6: 8:00 - 17:00",
    action: null
  }
]

const inquiryTypes = [
  { value: "technical", label: "Hỗ trợ kỹ thuật", icon: Bug },
  { value: "account", label: "Vấn đề tài khoản", icon: User },
  { value: "document", label: "Vấn đề tài liệu", icon: HelpCircle },
  { value: "suggestion", label: "Đề xuất cải thiện", icon: Lightbulb },
  { value: "other", label: "Khác", icon: MessageCircle }
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiryType: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc")
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success("Gửi liên hệ thành công! Chúng tôi sẽ phản hồi trong vòng 24 giờ.")
      setFormData({
        name: "",
        email: "",
        inquiryType: "",
        subject: "",
        message: ""
      })
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ với chúng tôi qua các kênh dưới đây
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Gửi tin nhắn
                </CardTitle>
                <CardDescription>
                  Điền thông tin dưới đây và chúng tôi sẽ phản hồi sớm nhất có thể
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Họ và tên *</Label>
                      <Input
                        id="name"
                        placeholder="Nhập họ và tên"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inquiryType">Loại yêu cầu</Label>
                    <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange("inquiryType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại yêu cầu" />
                      </SelectTrigger>
                      <SelectContent>
                        {inquiryTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Tiêu đề</Label>
                    <Input
                      id="subject"
                      placeholder="Nhập tiêu đề tin nhắn"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Nội dung *</Label>
                    <Textarea
                      id="message"
                      placeholder="Mô tả chi tiết vấn đề hoặc yêu cầu của bạn..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        Đang gửi...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Gửi tin nhắn
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Quick Contact Cards */}
            <div className="grid grid-cols-2 gap-4">
              {inquiryTypes.slice(0, 4).map((type) => (
                <Card key={type.value} className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <type.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h4 className="font-semibold text-sm">{type.label}</h4>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin liên hệ</CardTitle>
                <CardDescription>
                  Các cách khác để liên hệ với đội ngũ UduLib
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors group">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <method.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-semibold">{method.title}</h3>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                      <p className="font-medium">{method.contact}</p>
                      {method.action && (
                        <Button asChild variant="outline" size="sm" className="mt-2">
                          <a href={method.action}>Liên hệ ngay</a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Response Time Info */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-green-800 dark:text-green-200">Cam kết hỗ trợ</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-700 dark:text-green-300">
                      Phản hồi email trong vòng 24 giờ
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-700 dark:text-green-300">
                      Hỗ trợ khẩn cấp trong giờ làm việc
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-700 dark:text-green-300">
                      Đội ngũ kỹ thuật chuyên nghiệp
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Suggestion */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-blue-800 dark:text-blue-200">Trước khi liên hệ</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                  Có thể câu trả lời bạn cần đã có trong trang câu hỏi thường gặp của chúng tôi
                </p>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <a href="/faq">Xem FAQ</a>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a href="/guide">Hướng dẫn</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">24h</div>
                <p className="text-sm text-muted-foreground">Thời gian phản hồi</p>
              </div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">98%</div>
                <p className="text-sm text-muted-foreground">Tỷ lệ hài lòng</p>
              </div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">1000+</div>
                <p className="text-sm text-muted-foreground">Yêu cầu đã xử lý</p>
              </div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">5.0</div>
                <div className="flex items-center justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Đánh giá trung bình</p>
              </div>
            </CardContent>
          </Card>
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