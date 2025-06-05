import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("access_token")
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
    
    console.log("API Headers:", headers) // Debug log
    return headers
  }

  private handleAuthError() {
    // Clear stored auth data
    localStorage.removeItem("user")
    localStorage.removeItem("access_token")
    
    // Show error message
    toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại", {
      duration: 3000,
      position: "top-center"
    })
    
    // Redirect to login page
    window.location.href = "/login"
  }

  private async handleResponse(response: Response) {
    console.log("Response status:", response.status) // Debug log
    console.log("Response headers:", Object.fromEntries(response.headers.entries())) // Debug log

    if (!response.ok) {
      if (response.status === 401) {
        this.handleAuthError()
        throw new Error("Unauthorized")
      }

      if (response.status === 403) {
        toast.error("Bạn không có quyền thực hiện hành động này", {
          duration: 3000,
          position: "top-center"
        })
        throw new Error("Forbidden")
      }

      // Try to get error details from response
      let errorMessage = "Đã xảy ra lỗi"
      try {
        const errorData = await response.json()
        console.log("Error response:", errorData) // Debug log
        errorMessage = errorData.detail || errorData.message || errorMessage
      } catch {
        // If can't parse error response, use status text
        errorMessage = response.statusText || errorMessage
      }

      throw new Error(errorMessage)
    }

    // Check if response has content
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      return response.json()
    }
    return null
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${API_URL}${endpoint}`)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.append(key, value.toString())
        }
      })
    }

    console.log("GET Request URL:", url.toString()) // Debug log

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: this.getAuthHeaders(),
      })

      return await this.handleResponse(response)
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error)
      
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        toast.error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.")
        throw new Error("Network Error")
      }
      
      throw error
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const url = `${API_URL}${endpoint}`
    console.log("POST Request URL:", url) // Debug log
    console.log("POST Request Data:", data) // Debug log

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      })

      return await this.handleResponse(response)
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error)
      
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        toast.error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.")
        throw new Error("Network Error")
      }
      
      throw error
    }
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const url = `${API_URL}${endpoint}`
    console.log("PUT Request URL:", url) // Debug log
    console.log("PUT Request Data:", data) // Debug log
    console.log("API_URL:", API_URL) // Debug log

    // Check if API_URL is properly set
    if (!API_URL) {
      console.error("API_URL is not defined in environment variables")
      toast.error("Cấu hình API không đúng. Vui lòng liên hệ quản trị viên.")
      throw new Error("API Configuration Error")
    }

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      })

      return await this.handleResponse(response)
    } catch (error) {
      console.error(`PUT ${endpoint} failed:`, error)
      
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.error("Network error details:", {
          url,
          headers: this.getAuthHeaders(),
          data
        })
        toast.error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc cấu hình API.")
        throw new Error("Network Error")
      }
      
      throw error
    }
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    const url = `${API_URL}${endpoint}`
    console.log("PATCH Request URL:", url) // Debug log

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: this.getAuthHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      })

      return await this.handleResponse(response)
    } catch (error) {
      console.error(`PATCH ${endpoint} failed:`, error)
      
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        toast.error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.")
        throw new Error("Network Error")
      }
      
      throw error
    }
  }

  async delete(endpoint: string): Promise<void> {
    const url = `${API_URL}${endpoint}`
    console.log("DELETE Request URL:", url) // Debug log

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      })

      await this.handleResponse(response)
    } catch (error) {
      console.error(`DELETE ${endpoint} failed:`, error)
      
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        toast.error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.")
        throw new Error("Network Error")
      }
      
      throw error
    }
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
      const response = await fetch(`${API_URL}/health`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
      return response.ok
    } catch {
      return false
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient()