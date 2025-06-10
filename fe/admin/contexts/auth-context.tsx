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
        // Check for token with consistent key
        const token = localStorage.getItem("access_token") || localStorage.getItem("token")
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
        // Clear both possible token keys
        localStorage.removeItem("access_token")
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error("Đăng nhập thất bại");
      const response: LoginResponse = await res.json();

      const { access_token, user } = response
      
      // Store token with consistent key - use access_token as primary
      localStorage.setItem("access_token", access_token)
      localStorage.setItem("token", access_token) // Keep both for backward compatibility
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
    // Clear both possible token keys
    localStorage.removeItem("access_token")
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