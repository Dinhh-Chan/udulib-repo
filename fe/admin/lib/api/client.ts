import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import { toast } from "sonner"

class ApiClient {
  private static instance: ApiClient
  private baseURL: string

  private constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1"
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

  private async handleError(error: unknown): Promise<never> {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError
      
      // Xử lý lỗi từ response
      if (axiosError.response) {
        const response = axiosError.response
        let errorMessage = "Có lỗi xảy ra"

        if (response.data && typeof response.data === "object") {
          const data = response.data as any
          errorMessage = data.detail || data.message || JSON.stringify(data)
        } else if (typeof response.data === "string") {
          errorMessage = response.data
        }

        throw new Error(errorMessage)
      }

      // Xử lý lỗi network
      if (axiosError.request) {
        throw new Error("Không thể kết nối đến server")
      }
    }

    // Xử lý lỗi khác
    throw error
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await axios.get<T>(`${this.baseURL}${url}`, {
        ...config,
        headers: this.getHeaders(),
      })
      return this.handleResponse(response)
    } catch (error) {
      return this.handleError(error)
    }
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await axios.post<T>(`${this.baseURL}${url}`, data, {
        ...config,
        headers: this.getHeaders(),
      })
      return this.handleResponse(response)
    } catch (error) {
      return this.handleError(error)
    }
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await axios.put<T>(`${this.baseURL}${url}`, data, {
        ...config,
        headers: this.getHeaders(),
      })
      return this.handleResponse(response)
    } catch (error) {
      return this.handleError(error)
    }
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await axios.delete<T>(`${this.baseURL}${url}`, {
        ...config,
        headers: this.getHeaders(),
      })
      return this.handleResponse(response)
    } catch (error) {
      return this.handleError(error)
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