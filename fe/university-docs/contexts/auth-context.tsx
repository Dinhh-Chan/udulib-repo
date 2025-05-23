"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { toast, Toaster } from "sonner"

interface User {
  id: string
  username: string
  email: string
  // Thêm các trường khác nếu cần
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi component mount
    const storedUser = localStorage.getItem("user")
    const token = localStorage.getItem("access_token")
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const login = (user: User, token: string) => {
    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("access_token", token)
    setUser(user)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("access_token")
    setUser(null)
    setIsAuthenticated(false)
    
    toast.success("Đăng xuất thành công", {
      duration: 2000,
      position: "top-center"
    })

    // Thêm độ trễ 2 giây trước khi chuyển trang
    setTimeout(() => {
      router.push("/")
    }, 2000)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      <Toaster position="top-center" richColors />
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