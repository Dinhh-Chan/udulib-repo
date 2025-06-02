export interface Year {
  year_id: number
  year_name: string
  year_order: number
  created_at: string
  updated_at: string | null
}

export interface YearCreate {
  year_name: string
  year_order: number
}

export interface YearUpdate {
  year_name?: string
  year_order?: number
} 