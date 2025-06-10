import { apiClientAxios as apiClient } from "./client"
import { AxiosResponse } from "axios"

export interface OverviewStatistics {
  total_documents: number
  total_users: number
  total_subjects: number
  total_majors: number
  total_comments: number
  total_ratings: number
  total_views: number
  total_downloads: number
}

export interface DocumentStatusStats {
  status: string
  count: number
}

export interface DocumentBySubjectStats {
  subject_name: string
  count: number
}

export interface DocumentByMajorStats {
  major_name: string
  count: number
}

export interface FileTypeStats {
  file_type: string
  count: number
}

export interface MostViewedDocument {
  document_id: number
  title: string
  views: number
  subject_name: string
}

export interface MostDownloadedDocument {
  document_id: number
  title: string
  downloads: number
  subject_name: string
}

export interface ActivityByTime {
  date: string
  uploads: number
  comments: number
  ratings: number
}

export async function getOverviewStatistics(): Promise<OverviewStatistics> {
  const response: AxiosResponse<OverviewStatistics> = await apiClient.get("/statistics/overview")
  return response.data
}

export async function getDocumentsByStatus(): Promise<DocumentStatusStats[]> {
  const response: AxiosResponse<DocumentStatusStats[]> = await apiClient.get("/statistics/documents/by-status")
  return response.data
}

export async function getDocumentsBySubject(limit = 10): Promise<DocumentBySubjectStats[]> {
  const response: AxiosResponse<DocumentBySubjectStats[]> = await apiClient.get(`/statistics/documents/by-subject?limit=${limit}`)
  return response.data
}

export async function getDocumentsByMajor(): Promise<DocumentByMajorStats[]> {
  const response: AxiosResponse<DocumentByMajorStats[]> = await apiClient.get("/statistics/documents/by-major")
  return response.data
}

export async function getDocumentsByFileType(): Promise<FileTypeStats[]> {
  const response: AxiosResponse<FileTypeStats[]> = await apiClient.get("/statistics/documents/by-file-type")
  return response.data
}

export async function getMostViewedDocuments(limit = 10): Promise<MostViewedDocument[]> {
  const response: AxiosResponse<MostViewedDocument[]> = await apiClient.get(`/statistics/documents/most-viewed?limit=${limit}`)
  return response.data
}

export async function getMostDownloadedDocuments(limit = 10): Promise<MostDownloadedDocument[]> {
  const response: AxiosResponse<MostDownloadedDocument[]> = await apiClient.get(`/statistics/documents/most-downloaded?limit=${limit}`)
  return response.data
}

export async function getActivityByTime(days = 30): Promise<ActivityByTime[]> {
  const response: AxiosResponse<ActivityByTime[]> = await apiClient.get(`/statistics/activity/by-time?days=${days}`)
  return response.data
} 