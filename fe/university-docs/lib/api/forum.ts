import { Forum, ForumPost, ForumReply } from "@/types/forum"
import { getAuthToken } from "./auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL

// User APIs
export async function getUser(id: number): Promise<{
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
}> {
  const token = getAuthToken()
  if (!token) throw new Error("Unauthorized")

  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Không thể lấy thông tin người dùng")
    }
    return response.json()
  } catch (error) {
    console.error("Error fetching user:", error)
    throw error
  }
}

// Subject APIs
export async function getSubject(id: number): Promise<{ subject_id: number; subject_name: string }> {
  const token = getAuthToken()
  if (!token) throw new Error("Unauthorized")

  try {
    const response = await fetch(`${API_URL}/subjects/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Không thể lấy thông tin môn học")
    }
    return response.json()
  } catch (error) {
    console.error("Error fetching subject:", error)
    throw error
  }
}

// Forum APIs
export async function getForums(): Promise<Forum[]> {
  const token = getAuthToken()
  if (!token) throw new Error("Unauthorized")

  try {
    const response = await fetch(`${API_URL}/forums`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Không thể lấy danh sách diễn đàn")
    }
    const forums = await response.json()
    
    // Lấy thông tin môn học cho mỗi forum
    const forumsWithSubjects = await Promise.all(
      forums.map(async (forum: Forum) => {
        try {
          const subject = await getSubject(forum.subject_id)
          return {
            ...forum,
            subject_name: subject.subject_name
          }
        } catch (error) {
          console.error(`Error fetching subject for forum ${forum.forum_id}:`, error)
          return {
            ...forum,
            subject_name: "Không xác định"
          }
        }
      })
    )
    
    return forumsWithSubjects
  } catch (error) {
    console.error("Error fetching forums:", error)
    throw error
  }
}

export async function getForum(id: number): Promise<Forum> {
  const token = getAuthToken()
  if (!token) throw new Error("Unauthorized")

  try {
    const response = await fetch(`${API_URL}/forums/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Không thể lấy thông tin diễn đàn")
    }
    const forum = await response.json()
    
    // Lấy thông tin môn học
    try {
      const subject = await getSubject(forum.subject_id)
      return {
        ...forum,
        subject_name: subject.subject_name
      }
    } catch (error) {
      console.error(`Error fetching subject for forum ${forum.forum_id}:`, error)
      return {
        ...forum,
        subject_name: "Không xác định"
      }
    }
  } catch (error) {
    console.error("Error fetching forum:", error)
    throw error
  }
}

// Forum Post APIs
export async function getForumPosts(forumId: number): Promise<ForumPost[]> {
  const token = getAuthToken()
  if (!token) throw new Error("Unauthorized")

  try {
    const response = await fetch(`${API_URL}/forum-posts?forum_id=${forumId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Không thể lấy danh sách bài viết")
    }
    const posts = await response.json()
    
    // Lấy thông tin người đăng cho mỗi bài viết
    const postsWithAuthors = await Promise.all(
      posts.map(async (post: ForumPost) => {
        try {
          const author = await getUser(post.user_id)
          return {
            ...post,
            author: {
              user_id: author.user_id,
              username: author.username,
              full_name: author.full_name,
              email: author.email,
              university_id: author.university_id,
              role: author.role,
              status: author.status,
              created_at: author.created_at,
              updated_at: author.updated_at,
              last_login: author.last_login,
              google_id: author.google_id
            }
          }
        } catch (error) {
          console.error(`Error fetching author for post ${post.post_id}:`, error)
          return {
            ...post,
            author: {
              user_id: post.user_id,
              username: "Người dùng",
              full_name: "Người dùng",
              email: "",
              university_id: "",
              role: "user",
              status: "inactive",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              last_login: null,
              google_id: null
            }
          }
        }
      })
    )
    
    return postsWithAuthors
  } catch (error) {
    console.error("Error fetching forum posts:", error)
    throw error
  }
}

export async function getForumPost(id: number): Promise<ForumPost> {
  const token = getAuthToken()
  if (!token) throw new Error("Unauthorized")

  try {
    const response = await fetch(`${API_URL}/forum-posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Không thể lấy thông tin bài viết")
    }
    const post = await response.json()
    
    // Lấy thông tin người đăng
    try {
      const author = await getUser(post.user_id)
      return {
        ...post,
        author: {
          user_id: author.user_id,
          username: author.username,
          full_name: author.full_name,
          email: author.email,
          university_id: author.university_id,
          role: author.role,
          status: author.status,
          created_at: author.created_at,
          updated_at: author.updated_at,
          last_login: author.last_login,
          google_id: author.google_id
        }
      }
    } catch (error) {
      console.error(`Error fetching author for post ${post.post_id}:`, error)
      return {
        ...post,
        author: {
          user_id: post.user_id,
          username: "Người dùng",
          full_name: "Người dùng",
          email: "",
          university_id: "",
          role: "user",
          status: "inactive",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login: null,
          google_id: null
        }
      }
    }
  } catch (error) {
    console.error("Error fetching forum post:", error)
    throw error
  }
}

// Forum Reply APIs
export async function getForumReplies(postId: number, page: number = 1, perPage: number = 5): Promise<{replies: ForumReply[], total: number}> {
  const token = getAuthToken()
  if (!token) throw new Error("Unauthorized")

  try {
    const response = await fetch(`${API_URL}/forum-replies?post_id=${postId}&page=${page}&per_page=${perPage}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Không thể lấy danh sách bình luận")
    }
    const replies = await response.json()
    
    // Lấy thông tin người bình luận cho mỗi reply
    const repliesWithAuthors = await Promise.all(
      replies.map(async (reply: ForumReply) => {
        try {
          const author = await getUser(reply.user_id)
          return {
            ...reply,
            author: {
              user_id: author.user_id,
              username: author.username,
              full_name: author.full_name,
              email: author.email,
              university_id: author.university_id,
              role: author.role,
              status: author.status,
              created_at: author.created_at,
              updated_at: author.updated_at,
              last_login: author.last_login,
              google_id: author.google_id
            }
          }
        } catch (error) {
          console.error(`Error fetching author for reply ${reply.reply_id}:`, error)
          return {
            ...reply,
            author: {
              user_id: reply.user_id,
              username: "Người dùng",
              full_name: "Người dùng",
              email: "",
              university_id: "",
              role: "user",
              status: "inactive",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              last_login: null,
              google_id: null
            }
          }
        }
      })
    )
    
    // Lấy tổng số bình luận
    const totalResponse = await fetch(`${API_URL}/forum-replies?post_id=${postId}&page=1&per_page=1`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const totalData = await totalResponse.json()
    const total = totalData.length > 0 ? totalData[0].total_count : 0
    
    return {
      replies: repliesWithAuthors,
      total
    }
  } catch (error) {
    console.error("Error fetching forum replies:", error)
    throw error
  }
}

export async function createForumReply(data: {
  post_id: number
  content: string
  parent_id?: number | null
}): Promise<ForumReply> {
  const token = getAuthToken()
  if (!token) throw new Error("Unauthorized")

  try {
    const response = await fetch(`${API_URL}/forum-replies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Không thể tạo bình luận")
    }
    const reply = await response.json()
    
    // Lấy thông tin người bình luận
    try {
      const author = await getUser(reply.user_id)
      return {
        ...reply,
        author: {
          user_id: author.user_id,
          username: author.username,
          full_name: author.full_name,
          email: author.email,
          university_id: author.university_id,
          role: author.role,
          status: author.status,
          created_at: author.created_at,
          updated_at: author.updated_at,
          last_login: author.last_login,
          google_id: author.google_id
        }
      }
    } catch (error) {
      console.error(`Error fetching author for reply ${reply.reply_id}:`, error)
      return {
        ...reply,
        author: {
          user_id: reply.user_id,
          username: "Người dùng",
          full_name: "Người dùng",
          email: "",
          university_id: "",
          role: "user",
          status: "inactive",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login: null,
          google_id: null
        }
      }
    }
  } catch (error) {
    console.error("Error creating forum reply:", error)
    throw error
  }
} 