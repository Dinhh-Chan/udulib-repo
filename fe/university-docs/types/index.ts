export interface Major {
  major_id: number;
  major_name: string;
  slug: string;
  description: string;
  major_code?: string;
}

export interface Subject {
  subject_id: number;
  subject_name: string;
  description: string;
  subject_code?: string;
  major_id?: number;
  year_id?: number;
}

export interface Document {
  document_id: number;
  title: string;
  description: string;
  file_path: string;
  file_size: number;
  file_type: string;
  subject_id: number;
  user_id: number;
  status: string;
  view_count: number;
  download_count: number;
  created_at?: string;
  updated_at?: string;
  subject?: {
    subject_id: number;
    subject_name: string;
    subject_code?: string;
    major_id: number;
  };
  user?: {
    user_id: number;
    full_name: string;
    username: string;
  };
  tags?: { tag_id: number; tag_name: string; created_at?: string }[];
} 