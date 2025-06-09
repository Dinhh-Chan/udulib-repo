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
export async function getSubjects(): Promise<Array<{ subject_id: number; subject_name: string; subject_code: string }>> {
  const token = getAuthToken()
  if (!token) throw new Error("Unauthorized")

  try {
    const response = await fetch(`${API_URL}/subjects/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Không thể lấy danh sách môn học")
    }
    return response.json()
  } catch (error) {
    console.error("Error fetching subjects:", error)
    throw error
  }
}

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
export async function getForums(params?: {
  search?: string
  subject_id?: number
  page?: number
  per_page?: number
}): Promise<Forum[]> {
  const token = getAuthToken()
  if (!token) throw new Error("Unauthorized")

  try {
    // Xây dựng URL với query parameters
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append('search', params.search)
    if (params?.subject_id) searchParams.append('subject_id', params.subject_id.toString())
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.per_page) searchParams.append('per_page', params.per_page.toString())

    const url = `${API_URL}/forums${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    
    const response = await fetch(url, {
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
      forums.map(async (forum: any) => {
        try {
          const subject = await getSubject(forum.subject_id)
          return {
            forum_id: forum.forum_id,
            subject_id: forum.subject_id,
            subject_name: subject.subject_name,
            post_count: forum.post_count || 0,
            description: forum.description,
            created_at: forum.created_at
          }
        } catch (error) {
          console.error(`Error fetching subject for forum ${forum.forum_id}:`, error)
          return {
            forum_id: forum.forum_id,
            subject_id: forum.subject_id,
            subject_name: "Không xác định",
            post_count: forum.post_count || 0,
            description: forum.description,
            created_at: forum.created_at
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
export async function getForumReplies(postId: number, page: number = 1, perPage: number = 5): Promise<{replies: ForumReply[], total: number, total_pages: number, current_page: number}> {
  const token = getAuthToken()
  if (!token) throw new Error("Unauthorized")

  try {
    // API trả về tất cả replies, không phân trang ở backend
    const response = await fetch(`${API_URL}/forum-replies?post_id=${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Không thể lấy danh sách bình luận")
    }
    const allReplies = await response.json()
    
    // Function để lấy thông tin user và xử lý nested replies
    const processReply = async (reply: any): Promise<ForumReply> => {
      let author
      try {
        author = await getUser(reply.user_id)
      } catch (error) {
        console.error(`Error fetching author for reply ${reply.reply_id}:`, error)
        author = {
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

      // Xử lý child_replies nếu có
      let processedChildReplies: ForumReply[] = []
      if (reply.child_replies && reply.child_replies.length > 0) {
        processedChildReplies = await Promise.all(
          reply.child_replies.map((childReply: any) => processReply(childReply))
        )
      }

      return {
        reply_id: reply.reply_id,
        post_id: reply.post_id,
        user_id: reply.user_id,
        content: reply.content,
        created_at: reply.created_at,
        updated_at: reply.updated_at,
        status: reply.status,
        parent_reply_id: reply.parent_reply_id,
        child_replies: processedChildReplies,
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
    }
    
    // Xử lý tất cả replies với thông tin user
    const allProcessedReplies = await Promise.all(
      allReplies.map((reply: any) => processReply(reply))
    )
    
    // Tính toán phân trang ở frontend
    const totalMainReplies = allProcessedReplies.length
    const totalPages = Math.ceil(totalMainReplies / perPage)
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    
    // Lấy replies cho trang hiện tại
    const currentPageReplies = allProcessedReplies.slice(startIndex, endIndex)
    
    return {
      replies: currentPageReplies,
      total: totalMainReplies,
      total_pages: totalPages,
      current_page: page
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
      throw new Error(error.detail || "Không thể tạo phản hồi")
    }
    return response.json()
  } catch (error) {
    console.error("Error creating forum reply:", error)
    throw error
  }
}

// Reply cho một comment cụ thể
export async function createReplyToComment(replyId: number, content: string): Promise<ForumReply> {
  const token = getAuthToken()
  if (!token) throw new Error("Unauthorized")

  try {
    // Encode content để đảm bảo URL safe
    const encodedContent = encodeURIComponent(content)
    const response = await fetch(`${API_URL}/forum-replies/${replyId}/reply?reply_content=${encodedContent}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Không thể tạo phản hồi")
    }
    
    const reply = await response.json()
    
    // Lấy thông tin người reply
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
    console.error("Error creating reply to comment:", error)
    throw error
  }
}

// Get user forum posts với phân trang
export async function getUserForumPosts(userId: number, page: number = 1, per_page: number = 5): Promise<{
  posts: ForumPost[]
  total: number
  page: number
  per_page: number
  total_pages: number
}> {
  const token = getAuthToken()
  if (!token) throw new Error("Unauthorized")

  try {
    const response = await fetch(`${API_URL}/forum-posts?user_id=${userId}&page=${page}&per_page=${per_page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Không thể lấy danh sách bài viết")
    }
    
    const posts = await response.json()
    
    // Lấy thông tin chi tiết cho từng bài viết (forum, user)
    const postsWithDetails = await Promise.all(
      posts.map(async (post: ForumPost) => {
        try {
          // Lấy thông tin forum và subject
          const forum = await getForum(post.forum_id)
          const author = await getUser(post.user_id)
          
          return {
            ...post,
            forum_name: forum.subject_name,
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
          console.error(`Error fetching details for post ${post.post_id}:`, error)
          return {
            ...post,
            forum_name: "Không xác định",
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

    // Giả lập phân trang vì API có thể chưa trả về thông tin phân trang
    const total = postsWithDetails.length
    const total_pages = Math.ceil(total / per_page)
    
    return {
      posts: postsWithDetails,
      total,
      page,
      per_page,
      total_pages
    }
  } catch (error) {
    console.error("Error fetching user forum posts:", error)
    throw error
  }
}

// Tạo bài viết mới trong forum
export async function createForumPost(data: {
  forum_id: number
  title: string
  content: string
}): Promise<ForumPost> {
  const token = getAuthToken()
  if (!token) throw new Error("Unauthorized")

  try {
    const response = await fetch(`${API_URL}/forum-posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Không thể tạo bài viết")
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
      console.error(`Error fetching author for new post ${post.post_id}:`, error)
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
    console.error("Error creating forum post:", error)
    throw error
  }
}

// Xóa bài viết forum
export async function deleteForumPost(postId: number): Promise<void> {
  const token = getAuthToken()
  if (!token) throw new Error("Unauthorized")

  try {
    const response = await fetch(`${API_URL}/forum-posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Không thể xóa bài viết")
    }
  } catch (error) {
    console.error("Error deleting forum post:", error)
    throw error
  }
} 