import { apiClient } from "./client"

export interface Forum {
  forum_id: number
  subject_id: number
  description: string
  created_at: string
  updated_at: string
  subject?: {
    subject_id: number
    name: string
    code: string
  }
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
  user?: {
    user_id: number
    full_name: string
    email: string
  }
}

export interface ForumReply {
  reply_id: number
  post_id: number
  user_id: number
  content: string
  status: string
  created_at: string
  updated_at: string
  user?: {
    user_id: number
    full_name: string
    email: string
  }
}

export interface ForumCreate {
  subject_id: number
  description: string
}

export interface ForumUpdate {
  description: string
}

export interface ForumPostCreate {
  forum_id: number
  title: string
  content: string
}

export interface ForumReplyCreate {
  post_id: number
  content: string
}

export interface GetForumsParams {
  page?: number
  per_page?: number
}

export interface GetForumPostsParams {
  page?: number
  per_page?: number
  forum_id?: number
  user_id?: number
  status?: string
}

export interface GetForumRepliesParams {
  page?: number
  per_page?: number
  post_id?: number
  user_id?: number
  status?: string
}

// Forums
export async function getForums(params?: GetForumsParams): Promise<Forum[]> {
  return apiClient.get<Forum[]>("/forums", { params })
}

export async function getForumById(id: number): Promise<Forum> {
  return apiClient.get<Forum>(`/forums/${id}`)
}

export async function getForumBySubjectId(subjectId: number): Promise<Forum> {
  return apiClient.get<Forum>(`/forums/subject/${subjectId}`)
}

export async function createForum(data: ForumCreate): Promise<Forum> {
  return apiClient.post<Forum>("/forums", data)
}

export async function updateForum(id: number, data: ForumUpdate): Promise<Forum> {
  return apiClient.put<Forum>(`/forums/${id}`, data)
}

export async function deleteForum(id: number): Promise<void> {
  return apiClient.delete<void>(`/forums/${id}`)
}

// Forum Posts
export async function getForumPosts(params?: GetForumPostsParams): Promise<ForumPost[]> {
  return apiClient.get<ForumPost[]>("/forum-posts", { params })
}

export async function getForumPostById(id: number): Promise<ForumPost> {
  return apiClient.get<ForumPost>(`/forum-posts/${id}`)
}

export async function createForumPost(data: ForumPostCreate): Promise<ForumPost> {
  return apiClient.post<ForumPost>("/forum-posts", data)
}

export async function updateForumPost(id: number, data: Partial<ForumPostCreate> & { status?: string }): Promise<ForumPost> {
  return apiClient.put<ForumPost>(`/forum-posts/${id}`, data)
}

export async function deleteForumPost(id: number): Promise<void> {
  return apiClient.delete<void>(`/forum-posts/${id}`)
}

// Forum Replies
export async function getForumReplies(params?: GetForumRepliesParams): Promise<ForumReply[]> {
  return apiClient.get<ForumReply[]>("/forum-replies", { params })
}

export async function getForumReplyById(id: number): Promise<ForumReply> {
  return apiClient.get<ForumReply>(`/forum-replies/${id}`)
}

export async function createForumReply(data: ForumReplyCreate): Promise<ForumReply> {
  return apiClient.post<ForumReply>("/forum-replies", data)
}

export async function updateForumReply(id: number, data: Partial<ForumReplyCreate> & { status?: string }): Promise<ForumReply> {
  return apiClient.put<ForumReply>(`/forum-replies/${id}`, data)
}

export async function deleteForumReply(id: number): Promise<void> {
  return apiClient.delete<void>(`/forum-replies/${id}`)
}