export interface Forum {
  forum_id: number
  subject_id: number
  subject_name: string
  post_count: number
  description?: string
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
  department: string
  departmentSlug: string
  course?: string
  courseSlug?: string
  forum_name?: string
  reply_count?: number
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
  updated_at: string | null
  status: string
  parent_reply_id?: number | null
  child_replies?: ForumReply[]
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