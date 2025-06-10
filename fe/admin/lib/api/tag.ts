import { apiClientAxios as apiClient } from "./client"
import { AxiosResponse } from "axios"

export interface Tag {
  tag_id: number
  tag_name: string
  created_at: string
  updated_at: string
  document_count?: number
}

export interface TagCreate {
  tag_name: string
}

export interface TagUpdate {
  tag_name: string
}

export interface GetTagsParams {
  page?: number
  per_page?: number
  sort?: string
}

export async function getTags(params?: GetTagsParams): Promise<Tag[]> {
  const response: AxiosResponse<Tag[]> = await apiClient.get("/tags/with-document-count", { params })
  return response.data
}

export async function getTag(id: number): Promise<Tag> {
  const response: AxiosResponse<Tag> = await apiClient.get(`/tags/${id}`)
  return response.data
}

export async function createTag(data: TagCreate): Promise<Tag> {
  const response: AxiosResponse<Tag> = await apiClient.post("/tags", data)
  return response.data
}

export async function updateTag(id: number, data: TagUpdate): Promise<Tag> {
  const response: AxiosResponse<Tag> = await apiClient.put(`/tags/${id}`, data)
  return response.data
}

export async function deleteTag(id: number): Promise<void> {
  await apiClient.delete(`/tags/${id}`)
} 