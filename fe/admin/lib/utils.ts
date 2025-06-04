import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Kiểu cho toast options
type CustomToastOptions = {
  position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"
  className?: string
  duration?: number
}

// Tùy chỉnh toast options mặc định
const defaultToastOptions: CustomToastOptions = {
  position: "top-center",
  className: "toast-center",
  duration: 4000,
}

// Các hàm tiện ích hiển thị toast
export function showSuccessToast(message: string, options?: CustomToastOptions) {
  return toast.success(message, { ...defaultToastOptions, ...options })
}

export function showErrorToast(message: string, options?: CustomToastOptions) {
  return toast.error(message, { ...defaultToastOptions, ...options })
}

export function showInfoToast(message: string, options?: CustomToastOptions) {
  return toast(message, { ...defaultToastOptions, ...options })
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
