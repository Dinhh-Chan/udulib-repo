export interface Year {
  year_id: number
  year_name: string
  year_order: number
  created_at: string
  updated_at?: string
}

export interface YearCreate {
  year_name: string
  year_order: number
}

export interface YearUpdate {
  year_name: string
  year_order: number
}

export interface YearWithSubjectsCount extends Year {
  subjects_count: number
} 