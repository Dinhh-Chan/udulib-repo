import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast, ToastOptions } from "sonner"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Tùy chỉnh toast options mặc định
const defaultToastOptions: ToastOptions = {
  position: "top-center",
  className: "toast-center",
  duration: 4000,
}

// Các hàm tiện ích hiển thị toast
export function showSuccessToast(message: string, options?: ToastOptions) {
  return toast.success(message, { ...defaultToastOptions, ...options })
}

export function showErrorToast(message: string, options?: ToastOptions) {
  return toast.error(message, { ...defaultToastOptions, ...options })
}

export function showInfoToast(message: string, options?: ToastOptions) {
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
