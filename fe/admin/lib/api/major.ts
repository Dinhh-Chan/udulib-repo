import { Major, MajorCreate, MajorUpdate } from "@/types/major"
import { apiClient } from "./client"

export async function getMajors(): Promise<Major[]> {
  return await apiClient.get<Major[]>("/majors")
}

export async function getMajorCount(): Promise<number> {
  const response = await apiClient.get<{ count: number }>("/majors/count-major")
  return response.count
}

export async function getMajor(id: number): Promise<Major> {
  return await apiClient.get<Major>(`/majors/${id}`)
}

export async function createMajor(major: MajorCreate): Promise<Major> {
  return await apiClient.post<Major>("/majors/", major)
}

export async function updateMajor(id: number, major: MajorUpdate): Promise<Major> {
  return await apiClient.put<Major>(`/majors/${id}`, major)
}

export async function deleteMajor(id: number): Promise<void> {
  await apiClient.delete(`/majors/${id}`)
} 