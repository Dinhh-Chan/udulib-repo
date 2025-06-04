export interface Forum {
  forum_id: number
  subject_id: number
  subject_name: string
  post_count: number
}

export interface ForumPost {
  post_id: number
  forum_id: number
  user_id: number
  title: string
  content: string
  created_at: string
  updated_at: string
  status: string
  category: "question" | "discussion" | "resource" | "announcement"
  department: string
  departmentSlug: string
  course?: string
  courseSlug?: string
  author: {
    user_id: number
    username: string
    full_name: string
    email: string
    university_id: string
    role: string
    status: string
    created_at: string
    updated_at: string
    last_login: string | null
    google_id: string | null
  }
}

export interface ForumReply {
  reply_id: number
  post_id: number
  user_id: number
  content: string
  created_at: string
  updated_at: string
  status: string
  parent_id?: number | null
  replies?: ForumReply[]
  author: {
    user_id: number
    username: string
    full_name: string
    email: string
    university_id: string
    role: string
    status: string
    created_at: string
    updated_at: string
    last_login: string | null
    google_id: string | null
  }
} 