import { User } from "@/types/user"
import { getAuthToken } from "./auth"

export const getUserProfile = async (userId: string): Promise<User> => {
  const token = getAuthToken()
  
  if (!token) {
    throw new Error("Không tìm thấy token xác thực")
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  })

  if (!response.ok) {
    throw new Error("Không thể lấy thông tin người dùng")
  }

  return response.json()
}

export const updateUserProfile = async (userId: number, userData: {
  full_name: string;
  email: string;
  university_id: string;
}) => {
  const token = getAuthToken()
  
  if (!token) {
    throw new Error("Không tìm thấy token xác thực")
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Không thể cập nhật thông tin người dùng")
  }

  return response.json()
}

export const getUserAvatar = async (): Promise<string | null> => {
  const token = getAuthToken()
  
  if (!token) {
    return null
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/avatar`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "image/jpeg,image/png,image/gif,image/webp,image/*",
      }
    })

    if (!response.ok) {
      return null
    }

    // Kiểm tra content type
    const contentType = response.headers.get("content-type")
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml"
    ]

    if (!contentType || !validImageTypes.some(type => contentType.includes(type))) {
      console.error("Invalid content type:", contentType)
      return null
    }

    // Trả về URL blob để hiển thị
    const blob = await response.blob()
    return URL.createObjectURL(blob)
  } catch (error) {
    console.error("Error getting user avatar:", error)
    return null
  }
}

export const getUserAvatarById = async (userId: number): Promise<string | null> => {
  const token = getAuthToken()
  
  if (!token) {
    return null
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/avatar`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    })

    if (!response.ok) {
      return null
    }

    // Trả về URL blob để hiển thị
    const blob = await response.blob()
    return URL.createObjectURL(blob)
  } catch (error) {
    console.error(`Error getting avatar for user ${userId}:`, error)
    return null
  }
}

export const uploadAvatar = async (file: File): Promise<User> => {
  const token = getAuthToken()
  
  if (!token) {
    throw new Error("Không tìm thấy token xác thực")
  }

  try {
    const deleteResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/avatar`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!deleteResponse.ok) {
      console.log("User chưa có avatar")
    }
  } catch (error) {
    console.log("User chưa có avatar")
  }

  // Upload avatar mới
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/upload-avatar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json()
    const errorMessage = typeof errorData === 'object' ? JSON.stringify(errorData) : errorData
    throw new Error(`Không thể upload avatar: ${errorMessage}`)
  }

  return response.json()
}

export const changePassword = async (passwordData: {
  current_password: string;
  new_password: string;
  confirm_password: string;
}) => {
  const token = getAuthToken()
  
  if (!token) {
    throw new Error("Không tìm thấy token xác thực")
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(passwordData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Không thể thay đổi mật khẩu")
  }

  return response.json()
} 