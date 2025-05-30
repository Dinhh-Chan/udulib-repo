"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { User } from "@/types/user"
import { login as apiLogin } from "@/lib/api/auth"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Kiểm tra user từ localStorage khi component mount
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setIsAuthenticated(true)
        setIsAdmin(userData.role === "admin")
      } catch (error) {
        console.error("Error parsing stored user data:", error)
        localStorage.removeItem("user")
        localStorage.removeItem("access_token")
      }
    }
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await apiLogin(username, password)
      
      // Lưu token và user vào localStorage
      localStorage.setItem("access_token", response.access_token)
      localStorage.setItem("user", JSON.stringify(response.user))

      setUser(response.user)
      setIsAuthenticated(true)
      setIsAdmin(response.user.role === "admin")

      // Luôn chuyển về trang /admin sau khi đăng nhập thành công
      router.push("/admin")

      toast.success("Đăng nhập thành công!")
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!")
    }
  }

  const logout = () => {
    // Xóa dữ liệu từ localStorage
    localStorage.removeItem("access_token")
    localStorage.removeItem("user")
    
    // Reset state
    setUser(null)
    setIsAuthenticated(false)
    setIsAdmin(false)
    
    // Chuyển hướng về trang chủ
    router.push("/")
    toast.success("Đăng xuất thành công!")
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}