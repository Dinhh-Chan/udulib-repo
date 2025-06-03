"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { User } from "@/types/user"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  login: (user: User, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi component mount
    try {
      const storedUser = localStorage.getItem("user")
      const token = localStorage.getItem("access_token")
      
      if (storedUser && token) {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
        setIsAdmin(parsedUser.role === "admin")
      }
    } catch (error) {
      console.error("Error parsing stored user data:", error)
      // Clear invalid data
      localStorage.removeItem("user")
      localStorage.removeItem("access_token")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = (user: User, token: string) => {
    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("access_token", token)
    setUser(user)
    setIsAuthenticated(true)
    setIsAdmin(user.role === "admin")

    // Lấy callbackUrl từ URL search params
    const urlParams = new URLSearchParams(window.location.search)
    const callbackUrl = urlParams.get("callbackUrl")
    
<<<<<<< HEAD
=======
    toast.success("Đăng nhập thành công", {
      duration: 2000,
      position: "top-center"
    })
>>>>>>> 1d4cea5 (Merge branch 'sangne' of https://github.com/Dinhh-Chan/udulib-repo into tuantuan)

    // Nếu có callbackUrl thì chuyển hướng đến đó, nếu không thì về trang chủ
    if (callbackUrl) {
      router.push(callbackUrl)
    } else {
      router.push("/")
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("access_token")
    setUser(null)
    setIsAuthenticated(false)
    setIsAdmin(false)
    
    toast.success("Đăng xuất thành công", {
      duration: 2000,
      position: "top-center"
    })

    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isAdmin, 
      isLoading, 
      login, 
      logout 
    }}>
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