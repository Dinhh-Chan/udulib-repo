import { apiClient } from "./client"
import { User } from "@/types/user"

interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(`/auth/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`)
  return response
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout")
}

export const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}; 