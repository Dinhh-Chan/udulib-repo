"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface User {
  user_id: number
  username: string
  email: string
  full_name: string
  role: string
  status: string
  university_id: number
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
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
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

    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
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