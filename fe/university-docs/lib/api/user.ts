import { User } from "@/types/user"

export const getUserProfile = async (userId: string): Promise<User> => {
  const token = localStorage.getItem("access_token")
  
  if (!token) {
    throw new Error("Không tìm thấy token xác thực")
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
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