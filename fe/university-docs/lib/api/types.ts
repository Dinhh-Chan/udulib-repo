export interface Document {
  document_id: number
  title: string
  description: string
  file_path: string
  file_size: number
  file_type: string
  created_at: string
  updated_at: string
  view_count: number
  download_count: number
  average_rating: number
  subject: {
    subject_id: number
    subject_name: string
    subject_code: string
    description: string
    major_id: number
    year_id: number
  }
  user: {
    user_id: number
    username: string
    full_name: string
    email: string
  }
  tags: Array<{
    tag_id: number
    tag_name: string
  }>
}

export interface Rating {
  rating_id: number;
  document_id: number;
  user_id: number;
  score: number;
  comment?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Comment {
  comment_id: number;
  document_id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at?: string;
  user?: { full_name: string; username: string };
  replies?: Comment[];
  parent_comment_id?: number;
}

export interface UserInfo {
  user_id: number;
  username: string;
  full_name: string;
  email: string;
}

export interface PreviewSupport {
  is_supported: boolean;
  file_category: string;
  document_id?: number;
  file_type?: string;
  filename?: string;
} 