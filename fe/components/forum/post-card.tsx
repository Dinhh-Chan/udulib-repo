import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Eye, ThumbsUp, Clock, User } from "lucide-react"

interface ForumPost {
  id: string
  title: string
  excerpt: string
  author: string
  authorAvatar?: string
  date: string
  category: "question" | "discussion" | "resource" | "announcement"
  department: string
  departmentSlug: string
  course?: string
  courseSlug?: string
  tags?: string[]
  replies: number
  views: number
  likes: number
}

export default function PostCard({ post }: { post: ForumPost }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              <Link href={`/forum/${post.id}`} className="hover:underline">
                {post.title}
              </Link>
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={post.category === "question" ? "default" : "outline"}>
                {post.category === "question"
                  ? "Câu hỏi"
                  : post.category === "discussion"
                    ? "Thảo luận"
                    : post.category === "resource"
                      ? "Tài nguyên"
                      : "Thông báo"}
              </Badge>
              <Link
                href={`/departments/${post.departmentSlug}`}
                className="text-sm text-muted-foreground hover:underline"
              >
                {post.department}
              </Link>
              {post.course && (
                <>
                  <span className="text-sm text-muted-foreground">•</span>
                  <Link
                    href={`/departments/${post.departmentSlug}/courses/${post.courseSlug}`}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    {post.course}
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.authorAvatar || "/placeholder.svg"} alt={post.author} />
              <AvatarFallback>{post.author.substring(0, 2)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {post.tags?.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{post.date}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{post.replies}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{post.views}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            <span>{post.likes}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
