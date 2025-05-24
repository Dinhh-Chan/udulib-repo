export interface Major {
  id: any
  major_id: number
  major_name: string
  major_code: string
  description?: string
  created_at: string
  updated_at: string
}

export interface MajorCreate {
  major_name: string
  major_code: string
  description?: string
}

export interface MajorUpdate {
  major_name?: string
  major_code?: string
  description?: string
} 