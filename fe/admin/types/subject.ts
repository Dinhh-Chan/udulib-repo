export interface Subject {
  subject_id: number
  subject_name: string
  subject_code: string
  description?: string
  major_id: number
  major_name: string
  year_id: number
  year_name: string
  created_at: string
  updated_at: string | null
}

export interface SubjectCreate {
  subject_name: string
  subject_code: string
  description?: string
  major_id: number
  year_id: number
}

export interface SubjectUpdate {
  subject_name?: string
  subject_code?: string
  description?: string
  major_id?: number
  year_id?: number
} 