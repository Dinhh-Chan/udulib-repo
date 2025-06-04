import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

interface RequestOptions extends RequestInit {
  params?: Record<string, any>
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options
    
    let url = `${this.baseUrl}${endpoint}`
    
    // Xử lý params nếu có
    if (params) {
      const queryParams = new URLSearchParams()
      for (const key in params) {
        if (params[key] !== undefined && params[key] !== null) {
          queryParams.append(key, params[key].toString())
        }
      }
      const queryString = queryParams.toString()
      if (queryString) {
        url += `?${queryString}`
      }
    }
    
    const token = localStorage.getItem("token")

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...fetchOptions.headers,
    }

    const config: RequestInit = {
      ...fetchOptions,
      headers,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 405) {
          toast.error(`Phương thức ${options.method} không được phép cho endpoint ${endpoint}`);
          return Promise.reject({ type: 'silent', message: `Method ${options.method} Not Allowed` });
        }
        if (data.detail) {
          if (Array.isArray(data.detail)) {
            const errorMessage = data.detail[0]?.msg || "Lỗi xác thực dữ liệu";
            toast.error(errorMessage);
            return Promise.reject({ type: 'silent', message: errorMessage });
          }
          toast.error(data.detail);
          return Promise.reject({ type: 'silent', message: data.detail });
        }
        toast.error(`Lỗi HTTP ${response.status}: ${response.statusText}`);
        return Promise.reject({ type: 'silent', message: `HTTP Error ${response.status}` });
      }

      return data;
    } catch (error: any) {
      if (error.type === 'silent') {
        return Promise.reject(error);
      }
      
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
      return Promise.reject({ type: 'silent', message: "Unexpected error" });
    }
  }

  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" })
  }

  async post<T>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async patch<T>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" })
  }

  async postFormData<T>(endpoint: string, formData: FormData, options: RequestOptions = {}): Promise<T> {
    const token = localStorage.getItem("token")
    const headers: HeadersInit = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    }

    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      headers,
      body: formData,
    })
  }

  // Utility method to check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem("token")
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
      const response = await fetch(`${this.baseUrl}/health`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
      return response.ok
    } catch {
      return false
    }
  }
}

export const apiClient = new ApiClient(API_URL)

export const apiClientAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
})

// Thêm interceptor để xử lý token
apiClientAxios.interceptors.request.use((config) => {
  // Kiểm tra cả hai nơi lưu token để đảm bảo tương thích
  const token = localStorage.getItem("access_token") || localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Thêm interceptor để xử lý response
apiClientAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message)
    
    // Nếu status là 401 thì đăng xuất và chuyển đến trang login
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token")
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    
    // Hiển thị thông báo lỗi
    if (error.response?.data?.detail) {
      if (typeof error.response.data.detail === 'string') {
        toast.error(error.response.data.detail)
      } else if (Array.isArray(error.response.data.detail)) {
        toast.error(error.response.data.detail[0]?.msg || "Validation error")
      }
    } else {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau")
    }
    
    return Promise.reject(error)
  }
)