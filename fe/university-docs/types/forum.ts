export interface Forum {
  forum_id: number
  subject_id: number
  subject_name: string
  created_at: string
  updated_at: string
  post_count: number
}

export interface ForumPost {
  post_id: number
  forum_id: number
  user_id: number
  title: string
  content: string
  status: string
  created_at: string
  updated_at: string
  author: {
    user_id: number
    username: string
    avatar_url?: string
  }
}

export interface ForumReply {
  reply_id: number
  post_id: number
  user_id: number
  content: string
  parent_reply_id?: number
  status: string
  created_at: string
  updated_at: string
  author: {
    user_id: number
    username: string
    avatar_url?: string
  }
  replies?: ForumReply[]
} 