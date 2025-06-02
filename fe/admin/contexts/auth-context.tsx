"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api/client"
import { toast } from "sonner"

interface User {
  user_id: number
  username: string
  email: string
  full_name: string
  role: string
  status: string
  created_at: string | null
  updated_at: string
  last_login: string
}

interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setUser(null)
          setIsAuthenticated(false)
          setIsAdmin(false)
          setIsLoading(false)
          return
        }

        const response = await apiClient.get<User>("/users/me")
        setUser(response)
        setIsAuthenticated(true)
        setIsAdmin(response.role === "admin")
      } catch (error) {
        console.error("Auth check failed:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
        setIsAuthenticated(false)
        setIsAdmin(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await apiClient.post<LoginResponse>("/auth/login", {
        username,
        password,
      })

      const { access_token, user } = response
      localStorage.setItem("token", access_token)
      localStorage.setItem("user", JSON.stringify(user))
      setUser(user)
      setIsAuthenticated(true)
      setIsAdmin(user.role === "admin")
      router.push("/admin")
      toast.success("Đăng nhập thành công")
    } catch (error) {
      console.error("Login failed:", error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Đăng nhập thất bại")
      }
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    setIsAuthenticated(false)
    setIsAdmin(false)
    router.push("/login")
    toast.success("Đăng xuất thành công")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, isAdmin, login, logout }}>
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