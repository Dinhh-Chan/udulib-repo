import { Document, Rating, Comment, UserInfo } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper function để lấy token
const getAuthHeaders = (): Record<string, string> => {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// API functions cho Document
export const fetchDocument = async (id: string): Promise<Document> => {
  const response = await fetch(`${API_URL}/documents/public/${id}`, {
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
}; 