import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import { toast } from "sonner"

class ApiClient {
  private static instance: ApiClient
  private baseURL: string

  private constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient()
    }
    return ApiClient.instance
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    // Lấy token từ localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token")
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }
    }

    return headers
  }

  private async handleResponse<T>(response: AxiosResponse<T>): Promise<T> {
    // Kiểm tra status code
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }

    // Xử lý lỗi
    let errorMessage = "Có lỗi xảy ra"
    
    if (response.data && typeof response.data === "object") {
      // Nếu response.data là object, lấy message từ detail hoặc message
      const data = response.data as any
      errorMessage = data.detail || data.message || JSON.stringify(data)
    } else if (typeof response.data === "string") {
      errorMessage = response.data
    }

    throw new Error(errorMessage)
  }

  private async handleError(error: any): Promise<never> {
    if (error.response) {
      const { status, data } = error.response
      
      // Xử lý lỗi 401 (Unauthorized)
      if (status === 401) {
        // Xóa token và user data
        localStorage.removeItem("access_token")
        localStorage.removeItem("user")
        
        // Chuyển hướng về trang login
        window.location.href = "/login"
        throw new Error("Unauthorized")
      }

      // Xử lý lỗi 403 (Forbidden)
      if (status === 403) {
        throw new Error("Forbidden")
      }

      // Xử lý lỗi validation
      if (status === 422) {
        const errorMessage = data.detail?.[0]?.msg || "Validation error"
        throw new Error(errorMessage)
      }

      // Xử lý các lỗi khác
      const errorMessage = data.detail || data.message || "An error occurred"
      throw new Error(errorMessage)
    }

    // Xử lý lỗi network
    if (error.request) {
      throw new Error("Network error")
    }

    // Xử lý lỗi khác
    throw new Error(error.message || "An error occurred")
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      // Lấy token từ localStorage
      const token = localStorage.getItem("access_token")
      
      // Thêm headers
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      }

      // Gọi API
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      })

      // Parse response
      const data = await response.json()

      // Kiểm tra lỗi
      if (!response.ok) {
        throw { response: { status: response.status, data } }
      }

      return data
    } catch (error) {
      return this.handleError(error)
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ""
    return this.request<T>(`${endpoint}${queryString}`)
  }

  async post<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
      ...options,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    })
  }

  // Utility method to check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem("access_token")
  }

  // Utility method to get current user
  getCurrentUser(): any {
    try {
      const userStr = localStorage.getItem("user")
      return userStr ? JSON.parse(userStr) : null
    } catch {
      return null
    }
  }

  // Test connection method
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
      return response.ok
    } catch {
      return false
    }
  }
}

export const apiClient = ApiClient.getInstance()