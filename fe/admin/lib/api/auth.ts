import { apiClientAxios as apiClient } from "./client"
import { AxiosResponse } from "axios"
import { User } from "@/types/user"

interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);
  
  const response: AxiosResponse<LoginResponse> = await apiClient.post(
    "/auth/login", 
    formData.toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  )
  return response.data
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout", {})
}

export const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}; 