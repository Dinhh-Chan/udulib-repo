import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThumbsUp, MessageSquare, Flag } from "lucide-react"
import { Separator } from "@/components/ui/separator"

// Dữ liệu mẫu cho bình luận
const comments = [
  {
    id: 1,
    user: {
      name: "Nguyễn Văn X",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Sinh viên",
    },
    content: "Tài liệu rất hữu ích cho việc học HTML và CSS. Cảm ơn bạn đã chia sẻ!",
    date: "2023-05-15T10:30:00",
    likes: 12,
    replies: [
      {
        id: 3,
        user: {
          name: "Trần Thị Y",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "Giảng viên",
        },
        content: "Rất vui khi tài liệu giúp ích cho bạn. Nếu có thắc mắc gì, bạn có thể hỏi thêm.",
        date: "2023-05-15T14:20:00",
        likes: 5,
      },
    ],
  },
  {
    id: 2,
    user: {
      name: "Lê Văn Z",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Sinh viên",
    },
    content: "Phần CSS Flexbox trong tài liệu này giải thích rất rõ ràng. Tôi đã hiểu hơn rất nhiều so với trước đây.",
    date: "2023-05-14T16:45:00",
    likes: 8,
    replies: [],
  },
]

export default function DocumentComments() {
  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="space-y-4">
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
              <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{comment.user.name}</span>
                <span className="text-xs text-muted-foreground">{comment.user.role}</span>
              </div>
              <p className="text-sm mb-2">{comment.content}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{new Date(comment.date).toLocaleString("vi-VN")}</span>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs gap-1">
                  <ThumbsUp className="h-3 w-3" />
                  <span>{comment.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>Trả lời</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs gap-1">
                  <Flag className="h-3 w-3" />
                  <span>Báo cáo</span>
                </Button>
              </div>

              {/* Phần trả lời */}
              {comment.replies.length > 0 && (
                <div className="mt-4 pl-6 border-l-2 space-y-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={reply.user.avatar || "/placeholder.svg"} alt={reply.user.name} />
                        <AvatarFallback>{reply.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{reply.user.name}</span>
                          <span className="text-xs text-muted-foreground">{reply.user.role}</span>
                        </div>
                        <p className="text-sm mb-2">{reply.content}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{new Date(reply.date).toLocaleString("vi-VN")}</span>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            <span>{reply.likes}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs gap-1">
                            <Flag className="h-3 w-3" />
                            <span>Báo cáo</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <Separator />
        </div>
      ))}
    </div>
  )
}
