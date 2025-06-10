import { Document, Rating, Comment, UserInfo } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper function để lấy token
const getAuthHeaders = (): Record<string, string> => {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// API functions cho Document
export const fetchDocument = async (id: string): Promise<Document> => {
<<<<<<< HEAD
  const response = await fetch(`${API_URL}/documents/public/${id}`, {
=======
  const response = await fetch(`${API_URL}/documents/${id}`, {
>>>>>>> 3c35902094cc5ae9d14dcaca99c44a5ed2a2d9ed
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    throw new Error(`Lỗi khi tải dữ liệu: ${response.status}`);
  }
  
  return await response.json();
};

// API functions cho View Count
export const checkUserViewHistory = async (documentId: string, userId: number): Promise<any[]> => {
  const response = await fetch(
    `${API_URL}/history/?document_id=${documentId}&user_id=${userId}&page=1&per_page=1`,
    { headers: getAuthHeaders() }
  );
  
  return await response.json();
};

export const increaseViewCount = async (documentId: string): Promise<void> => {
  await fetch(`${API_URL}/documents/${documentId}/view`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
};

// API functions cho Ratings
export const fetchRatings = async (documentId: string): Promise<Rating[]> => {
  const response = await fetch(`${API_URL}/ratings/?document_id=${documentId}`, {
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error("Không thể tải đánh giá");
  }
  
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const createRating = async (documentId: string, score: number): Promise<Rating> => {
  const response = await fetch(`${API_URL}/ratings/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      document_id: Number(documentId),
      score: score,
    }),
  });
  
  if (!response.ok) {
    throw new Error("Không thể gửi đánh giá");
  }
  
  return await response.json();
};

// API functions cho Comments
export const fetchComments = async (documentId: string): Promise<Comment[]> => {
  const response = await fetch(
    `${API_URL}/comments/?document_id=${documentId}&include_replies=true&page=1&per_page=20`,
    { headers: getAuthHeaders() }
  );
  
  if (!response.ok) {
    throw new Error("Không thể tải bình luận");
  }
  
  return await response.json();
};

export const createComment = async (documentId: string, content: string, parentId?: number): Promise<Comment> => {
  const response = await fetch(`${API_URL}/comments/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      document_id: Number(documentId),
      content: content,
      ...(parentId && { parent_comment_id: parentId }),
    }),
  });
  
  if (!response.ok) {
    throw new Error("Không thể gửi bình luận");
  }
  
  return await response.json();
};

export const fetchReplies = async (parentId: number): Promise<Comment[]> => {
  const response = await fetch(
    `${API_URL}/comments/?parent_comment_id=${parentId}&page=1&per_page=20`,
    { headers: getAuthHeaders() }
  );
  
  if (!response.ok) {
    throw new Error("Không thể tải replies");
  }
  
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

// API functions cho User Info
export const fetchUserInfo = async (userId: number): Promise<UserInfo> => {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    return { user_id: userId, full_name: "Ẩn danh", username: "", email: "" };
  }
  
  const userData = await response.json();
  return {
    user_id: userId,
    full_name: userData.full_name,
    username: userData.username,
    email: userData.email
  };
};

// Utility functions
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);
  return `${size.toFixed(1)} ${sizes[i]}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const buildCommentTree = (flatComments: Comment[]): Comment[] => {
  const map: { [id: number]: Comment } = {};
  const roots: Comment[] = [];

  // Tạo map comment_id -> comment
  flatComments.forEach(comment => {
    map[comment.comment_id] = { ...comment, replies: [] };
  });

  // Gắn replies vào comment cha
  flatComments.forEach(comment => {
    if (comment.parent_comment_id) {
      const parent = map[comment.parent_comment_id];
      if (parent) {
        if (!parent.replies) parent.replies = [];
        parent.replies.push(map[comment.comment_id]);
      }
    } else {
      roots.push(map[comment.comment_id]);
    }
  });

  return roots;
};

export const fillUserInfoForComments = async (comments: Comment[]): Promise<void> => {
  for (const comment of comments) {
    if (!comment.user && comment.user_id) {
      comment.user = await fetchUserInfo(comment.user_id);
    }
    if (comment.replies && comment.replies.length > 0) {
      await fillUserInfoForComments(comment.replies);
    }
  }
<<<<<<< HEAD
};

export interface DocumentStats {
  is_liked: boolean;
  like_count: number;
  view_count: number;
  download_count: number;
}

export async function getDocumentStats(documentId: number): Promise<DocumentStats> {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/stats`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) throw new Error("Không thể lấy thống kê tài liệu");
  return await response.json();
}

export async function likeDocument(documentId: number): Promise<DocumentStats> {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (!token) throw new Error("Bạn cần đăng nhập để thực hiện chức năng này");
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/like`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Không thể like tài liệu");
  return await response.json();
}

export async function unlikeDocument(documentId: number): Promise<DocumentStats> {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (!token) throw new Error("Bạn cần đăng nhập để thực hiện chức năng này");
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/like`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Không thể bỏ like tài liệu");
  return await response.json();
}

export async function toggleLikeDocument(documentId: number): Promise<DocumentStats> {
  // Lấy trạng thái like hiện tại từ API stats
  const currentStats = await getDocumentStats(documentId);
  
  // Dựa vào trạng thái is_liked để quyết định gọi API nào
  if (currentStats.is_liked) {
    return await unlikeDocument(documentId);
  } else {
    return await likeDocument(documentId);
  }
}

export async function fetchDocumentsBySubject(subject_id: number, per_page: number = 10) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/public?subject_id=${subject_id}&per_page=${per_page}`);
  const data = await res.json();
  return Array.isArray(data.documents) ? data.documents : [];
}

export type Major = {
  major_id: number;
  major_name: string;
  major_code: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export type SubjectStat = {
  major_id: number;
  major_name: string;
  major_code: string;
  subject_count: number;
}

export type DocumentStat = {
  major_code: string;
  document_count: number;
}

export async function fetchMajors(): Promise<Major[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/majors/`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchSubjectsByMajorAndYear(major_id: number, year_id: number) {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subjects/?major_id=${major_id}&year_id=${year_id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return await res.json();
}

export async function fetchDocumentCountBySubject(subject_id: number) {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/public?subject_id=${subject_id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const data = await res.json();
  return Array.isArray(data.documents) ? data.documents.length : 0;
}

export async function fetchDocumentStatsByMajor() {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/statistics/documents/by-major`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return await res.json();
}

export async function fetchSubjectStatsByMajor() {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subjects/count-by-major`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return await res.json();
} 
=======
}; 
>>>>>>> 3c35902094cc5ae9d14dcaca99c44a5ed2a2d9ed
