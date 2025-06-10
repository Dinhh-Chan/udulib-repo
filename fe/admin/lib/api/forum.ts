import { apiClientAxios as apiClient } from "./client"
import { AxiosResponse } from "axios"

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
    username?: string
  }
  reply_count: number
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

// Forums - Using consistent apiClient (axios)
export async function getForums(params?: GetForumsParams): Promise<Forum[]> {
  const response: AxiosResponse<Forum[]> = await apiClient.get("/forums/", { params })
  return response.data
}

export async function getForumById(id: number): Promise<Forum> {
  const response: AxiosResponse<Forum> = await apiClient.get(`/forums/${id}`)
  return response.data
}

export async function getForumBySubjectId(subjectId: number): Promise<Forum> {
  const response: AxiosResponse<Forum> = await apiClient.get(`/forums/subject/${subjectId}`)
  return response.data
}

export async function createForum(data: ForumCreate): Promise<Forum> {
  const response: AxiosResponse<Forum> = await apiClient.post("/forums/", data)
  return response.data
}

export async function updateForum(id: number, data: ForumUpdate): Promise<Forum> {
  const response: AxiosResponse<Forum> = await apiClient.put(`/forums/${id}`, data)
  return response.data
}

export async function deleteForum(id: number): Promise<void> {
  await apiClient.delete(`/forums/${id}`)
}

// Forum Posts - Using consistent apiClient (axios)
export async function getForumPosts(params?: GetForumPostsParams): Promise<ForumPost[]> {
  const response: AxiosResponse<ForumPost[]> = await apiClient.get("/forum-posts", { params })
  return response.data
}

export async function getForumPostById(id: number): Promise<ForumPost> {
  const response: AxiosResponse<ForumPost> = await apiClient.get(`/forum-posts/${id}`)
  return response.data
}

export async function createForumPost(data: ForumPostCreate): Promise<ForumPost> {
  const response: AxiosResponse<ForumPost> = await apiClient.post("/forum-posts", data)
  return response.data
}

export async function updateForumPost(id: number, data: Partial<ForumPostCreate> & { status?: string }): Promise<ForumPost> {
  const response: AxiosResponse<ForumPost> = await apiClient.put(`/forum-posts/${id}`, data)
  return response.data
}

export async function deleteForumPost(id: number): Promise<void> {
  await apiClient.delete(`/forum-posts/${id}`)
}

// Forum Replies - Using consistent apiClient (axios)
export async function getForumReplies(params?: GetForumRepliesParams): Promise<ForumReply[]> {
  const response: AxiosResponse<ForumReply[]> = await apiClient.get("/forum-replies", { params })
  return response.data
}

export async function getForumReplyById(id: number): Promise<ForumReply> {
  const response: AxiosResponse<ForumReply> = await apiClient.get(`/forum-replies/${id}`)
  return response.data
}

export async function createForumReply(data: ForumReplyCreate): Promise<ForumReply> {
  const response: AxiosResponse<ForumReply> = await apiClient.post("/forum-replies", data)
  return response.data
}

export async function updateForumReply(id: number, data: Partial<ForumReplyCreate> & { status?: string }): Promise<ForumReply> {
  const response: AxiosResponse<ForumReply> = await apiClient.put(`/forum-replies/${id}`, data)
  return response.data
}

export async function deleteForumReply(id: number): Promise<void> {
  await apiClient.delete(`/forum-replies/${id}`)
}

// Enhanced functions - Using consistent apiClient (axios)
export async function getEnhancedForumPost(id: number): Promise<ForumPost> {
  try {
    console.log(`Gọi API lấy bài viết diễn đàn ${id} với thông tin người dùng`);
    
    // Lấy thông tin bài viết
    const post = await getForumPostById(id);
    
    // Nếu không có thông tin user_id hoặc đã có username, trả về luôn
    if (!post.user_id || (post.user && post.user.username)) {
      return post;
    }
    
    // Lấy thông tin chi tiết người dùng
    try {
      const userResponse: AxiosResponse<any> = await apiClient.get(`/users/${post.user_id}`);
      const user = userResponse.data;
      
      // Cập nhật thông tin người dùng vào bài viết
      return {
        ...post,
        user: {
          user_id: post.user_id,
          full_name: user.full_name || post.user?.full_name || 'Người dùng',
          email: user.email || post.user?.email || '',
          username: user.username || 'Người dùng'
        }
      };
    } catch (error) {
      console.error(`Không thể lấy thông tin người dùng cho bài viết ${id}:`, error);
      return post;
    }
  } catch (error) {
    console.error(`Error fetching enhanced forum post ${id}:`, error);
    throw error;
  }
}

export async function getEnhancedForumPosts(params?: GetForumPostsParams): Promise<ForumPost[]> {
  try {
    console.log(`Gọi API lấy danh sách bài viết diễn đàn với thông tin người dùng`);
    
    // Lấy danh sách bài viết
    const posts = await getForumPosts(params);
    
    // Lấy thông tin chi tiết người dùng và gán vào từng bài viết
    const enhancedPosts = await Promise.all(
      posts.map(async (post) => {
        // Nếu không có thông tin user_id hoặc đã có username, trả về luôn
        if (!post.user_id || (post.user && post.user.username)) {
          return post;
        }
        
        // Lấy thông tin chi tiết người dùng
        try {
          const userResponse: AxiosResponse<any> = await apiClient.get(`/users/${post.user_id}`);
          const user = userResponse.data;
          
          // Cập nhật thông tin người dùng vào bài viết
          return {
            ...post,
            user: {
              user_id: post.user_id,
              full_name: user.full_name || post.user?.full_name || 'Người dùng',
              email: user.email || post.user?.email || '',
              username: user.username || 'Người dùng'
            }
          };
        } catch (error) {
          console.error(`Không thể lấy thông tin người dùng cho bài viết ${post.post_id}:`, error);
          return post;
        }
      })
    );
    
    return enhancedPosts;
  } catch (error) {
    console.error(`Error fetching enhanced forum posts:`, error);
    throw error;
  }
}