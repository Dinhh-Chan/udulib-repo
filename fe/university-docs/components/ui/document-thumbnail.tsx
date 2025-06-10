"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { FileText, File, Image as ImageIcon, FileCode } from "lucide-react"
import { getPublicDocumentThumbnail,  } from "@/lib/api/documents"

interface DocumentThumbnailProps {
  documentId: number
  title: string
  fileType: string
  className?: string
  size?: "small" | "medium" | "large"
}

export function DocumentThumbnail({ 
  documentId, 
  title, 
  fileType, 
  className = "",
  size = "medium"
}: DocumentThumbnailProps) {
  const [imageError, setImageError] = useState(false)


  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "w-20 h-20 sm:w-24 sm:h-24"
      case "large":
        return "w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56"
      default:
        return "w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36"
    }
  }

  const getFileTypeIcon = () => {
    const iconClass = `transition-all duration-200 ${
      size === "small" 
        ? "w-8 h-8 sm:w-10 sm:h-10" 
        : size === "large" 
        ? "w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24" 
        : "w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14"
    }`
    return <ImageIcon className={`${iconClass} text-blue-500`} />
  }

  if (imageError) {
    // Fallback to file type icon
    const isFullSize = className.includes('!w-full !h-full')
    const fallbackClasses = isFullSize 
      ? `w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center ${className.replace('!w-full !h-full', '')}`
      : `${getSizeClasses()} bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 ${className}`
    
    return (
      <div className={fallbackClasses}>
        <div className="text-muted-foreground drop-shadow-sm">
          {getFileTypeIcon()}
        </div>
      </div>
    )
  }

  // Kiểm tra nếu className có chứa !w-full !h-full thì sử dụng full size
  const isFullSize = className.includes('!w-full !h-full')
  const containerClasses = isFullSize 
    ? `w-full h-full relative overflow-hidden ${className.replace('!w-full !h-full', '')}`
    : `${getSizeClasses()} relative overflow-hidden rounded-xl bg-muted shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group ${className}`

  return (
    <div className={containerClasses}>
      <Image
        src={getPublicDocumentThumbnail(documentId)}
        alt={title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        onError={() => setImageError(true)}
        sizes={isFullSize ? "100vw" : size === "small" ? "(max-width: 640px) 80px, 96px" : size === "large" ? "(max-width: 640px) 160px, (max-width: 1024px) 192px, 224px" : "(max-width: 640px) 112px, (max-width: 1024px) 128px, 144px"}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-xl"></div>
    </div>
  )
} 