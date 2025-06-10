import { Major, MajorCreate, MajorUpdate } from "@/types/major"
import { apiClientAxios as apiClient } from "./client"
import { AxiosResponse } from "axios"

export async function getMajors(page: number = 1, search: string = ""): Promise<Major[]> {
  const response: AxiosResponse<Major[]> = await apiClient.get(`/majors/?page=${page}&search=${search}`)
  return response.data
}

export async function getMajorCount(): Promise<number> {
  const response: AxiosResponse<{ count: number }> = await apiClient.get("/majors/count-major/")
  return response.data.count
}

export async function getMajor(id: number): Promise<Major> {
  const response: AxiosResponse<Major> = await apiClient.get(`/majors/${id}/`)
  return response.data
}

export async function createMajor(major: MajorCreate): Promise<Major> {
  const response: AxiosResponse<Major> = await apiClient.post("/majors/", major)
  return response.data
}

export async function updateMajor(id: number, major: MajorUpdate): Promise<Major> {
  const response: AxiosResponse<Major> = await apiClient.put(`/majors/${id}`, major)
  return response.data
}

export async function deleteMajor(id: number): Promise<void> {
  await apiClient.delete(`/majors/${id}/`)
} 