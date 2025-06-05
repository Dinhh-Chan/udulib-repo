"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  MessageSquare,
  Star,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Send,
  Lightbulb,
  Bug,
  Zap,
  Target,
  Users,
  CheckCircle,
  TrendingUp,
  Award
} from "lucide-react"
import { toast } from "sonner"

const feedbackCategories = [
  { value: "ui-ux", label: "Giao diện & Trải nghiệm", icon: Target },
  { value: "features", label: "Tính năng", icon: Zap },
  { value: "performance", label: "Hiệu suất", icon: TrendingUp },
  { value: "content", label: "Nội dung", icon: MessageSquare },
  { value: "community", label: "Cộng đồng", icon: Users },
  { value: "bug", label: "Báo lỗi", icon: Bug },
  { value: "suggestion", label: "Đề xuất cải thiện", icon: Lightbulb }
]

const satisfactionLevels = [
  { value: "1", label: "Rất không hài lòng", emoji: "😟", color: "text-red-500" },
  { value: "2", label: "Không hài lòng", emoji: "🙁", color: "text-orange-500" },
  { value: "3", label: "Bình thường", emoji: "😐", color: "text-yellow-500" },
  { value: "4", label: "Hài lòng", emoji: "🙂", color: "text-blue-500" },
  { value: "5", label: "Rất hài lòng", emoji: "😍", color: "text-green-500" }
]

const featureRatings = [
  { id: "search", label: "Tìm kiếm tài liệu" },
  { id: "upload", label: "Tải lên tài liệu" },
  { id: "interface", label: "Giao diện người dùng" },
  { id: "speed", label: "Tốc độ tải trang" },
  { id: "mobile", label: "Sử dụng trên mobile" },
  { id: "community", label: "Tính năng thảo luận" }
]

const improvementAreas = [
  { id: "more-formats", label: "Hỗ trợ thêm định dạng file" },
  { id: "better-search", label: "Cải thiện tìm kiếm" },
  { id: "mobile-app", label: "Ứng dụng di động" },
  { id: "notifications", label: "Hệ thống thông báo" },
  { id: "collaboration", label: "Tính năng cộng tác" },
  { id: "ai-features", label: "Tích hợp AI" }
]

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    satisfaction: "",
    message: "",
    recommend: "",
    featureRatings: {} as Record<string, number>,
    improvements: [] as string[]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFeatureRating = (featureId: string, rating: number) => {
    setFormData(prev => ({
      ...prev,
      featureRatings: { ...prev.featureRatings, [featureId]: rating }
    }))
  }

  const handleImprovementToggle = (improvementId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      improvements: checked 
        ? [...prev.improvements, improvementId]
        : prev.improvements.filter(id => id !== improvementId)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.message || !formData.satisfaction) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc")
      return
    }

    setIsSubmitting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success("Cảm ơn bạn đã gửi phản hồi! Chúng tôi sẽ xem xét và cải thiện dựa trên góp ý của bạn.")
      // Reset form
      setFormData({
        name: "",
        email: "",
        category: "",
        satisfaction: "",
        message: "",
        recommend: "",
        featureRatings: {},
        improvements: []
      })
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStarRating = (featureId: string, currentRating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 cursor-pointer transition-colors ${
              star <= currentRating 
                ? "text-yellow-400 fill-yellow-400" 
                : "text-gray-300 hover:text-yellow-400"
            }`}
            onClick={() => handleFeatureRating(featureId, star)}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Góp ý & Đánh giá
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Chia sẻ trải nghiệm của bạn để giúp chúng tôi cải thiện UduLib tốt hơn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feedback Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Đánh giá trải nghiệm
                </CardTitle>
                <CardDescription>
                  Hãy cho chúng tôi biết cảm nhận của bạn về UduLib
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Họ và tên (tùy chọn)</Label>
                      <Input
                        id="name"
                        placeholder="Nhập họ và tên"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email (tùy chọn)</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label>Loại phản hồi</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại phản hồi" />
                      </SelectTrigger>
                      <SelectContent>
                        {feedbackCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center gap-2">
                              <category.icon className="h-4 w-4" />
                              {category.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Satisfaction Rating */}
                  <div className="space-y-4">
                    <Label>Mức độ hài lòng tổng thể *</Label>
                    <RadioGroup 
                      value={formData.satisfaction} 
                      onValueChange={(value) => handleInputChange("satisfaction", value)}
                      className="grid grid-cols-1 md:grid-cols-5 gap-2"
                    >
                      {satisfactionLevels.map((level) => (
                        <div key={level.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={level.value} id={level.value} />
                          <Label htmlFor={level.value} className="flex flex-col items-center cursor-pointer p-3 rounded-lg hover:bg-muted transition-colors">
                            <span className="text-2xl mb-1">{level.emoji}</span>
                            <span className="text-xs text-center">{level.label}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Feature Ratings */}
                  <div className="space-y-4">
                    <Label>Đánh giá các tính năng</Label>
                    <div className="space-y-3">
                      {featureRatings.map((feature) => (
                        <div key={feature.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                          <span className="font-medium">{feature.label}</span>
                          {renderStarRating(feature.id, formData.featureRatings[feature.id] || 0)}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="space-y-4">
                    <Label>Bạn có giới thiệu UduLib cho bạn bè không?</Label>
                    <RadioGroup 
                      value={formData.recommend} 
                      onValueChange={(value) => handleInputChange("recommend", value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="yes" />
                        <Label htmlFor="yes" className="flex items-center gap-2 cursor-pointer">
                          <ThumbsUp className="h-4 w-4 text-green-500" />
                          Có
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no" />
                        <Label htmlFor="no" className="flex items-center gap-2 cursor-pointer">
                          <ThumbsDown className="h-4 w-4 text-red-500" />
                          Không
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="maybe" id="maybe" />
                        <Label htmlFor="maybe" className="cursor-pointer">
                          Có thể
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Improvement Areas */}
                  <div className="space-y-4">
                    <Label>Các lĩnh vực cần cải thiện (chọn nhiều)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {improvementAreas.map((area) => (
                        <div key={area.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={area.id}
                            checked={formData.improvements.includes(area.id)}
                            onCheckedChange={(checked) => handleImprovementToggle(area.id, checked as boolean)}
                          />
                          <Label htmlFor={area.id} className="cursor-pointer">
                            {area.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Chi tiết phản hồi *</Label>
                    <Textarea
                      id="message"
                      placeholder="Chia sẻ chi tiết về trải nghiệm của bạn, những gì bạn thích và không thích, đề xuất cải thiện..."
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
                        Gửi phản hồi
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Why Feedback Matters */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-blue-800 dark:text-blue-200">Tại sao phản hồi quan trọng?</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                      Giúp cải thiện trải nghiệm người dùng
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                      Ưu tiên phát triển tính năng mới
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                      Xây dựng cộng đồng tốt hơn
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Improvements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Cải thiện gần đây
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-sm">Tối ưu tốc độ tìm kiếm</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Dựa trên phản hồi về hiệu suất
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-sm">Giao diện dark mode</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Theo yêu cầu của cộng đồng
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                      <span className="font-medium text-sm">Bộ lọc nâng cao</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Cải thiện trải nghiệm tìm kiếm
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Anonymous Feedback */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
              <CardContent className="p-4">
                <div className="text-center space-y-2">
                  <Lightbulb className="h-8 w-8 text-amber-600 mx-auto" />
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200">Phản hồi ẩn danh</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Bạn có thể gửi phản hồi mà không cần điền thông tin cá nhân
                  </p>
                </div>
              </CardContent>
            </Card>
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