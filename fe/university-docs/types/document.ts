export interface Document {
  document_id: number;
  title: string;
  description: string;
  file_path: string;
  file_size: number;
  file_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  download_count: number;
  user_id: number;
  subject_id: number;
  subject?: {
    subject_id: number;
    subject_name: string;
  };
  user?: {
    user_id: number;
    full_name: string;
  };
  tags?: {
    tag_id: number;
    tag_name: string;
  }[];
} 