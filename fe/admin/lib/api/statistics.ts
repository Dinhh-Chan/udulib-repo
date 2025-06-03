import { apiClient } from "./client"

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

export async function getOverviewStatistics() {
  return await apiClient.get<OverviewStatistics>("/statistics/overview")
}

export async function getDocumentsByStatus() {
  return await apiClient.get<DocumentStatusStats[]>("/statistics/documents/by-status")
}

export async function getDocumentsBySubject(limit = 10) {
  return await apiClient.get<DocumentBySubjectStats[]>(`/statistics/documents/by-subject?limit=${limit}`)
}

export async function getDocumentsByMajor() {
  return await apiClient.get<DocumentByMajorStats[]>("/statistics/documents/by-major")
}

export async function getDocumentsByFileType() {
  return await apiClient.get<FileTypeStats[]>("/statistics/documents/by-file-type")
}

export async function getMostViewedDocuments(limit = 10) {
  return await apiClient.get<MostViewedDocument[]>(`/statistics/documents/most-viewed?limit=${limit}`)
}

export async function getMostDownloadedDocuments(limit = 10) {
  return await apiClient.get<MostDownloadedDocument[]>(`/statistics/documents/most-downloaded?limit=${limit}`)
}

export async function getActivityByTime(days = 30) {
  return await apiClient.get<ActivityByTime[]>(`/statistics/activity/by-time?days=${days}`)
} 