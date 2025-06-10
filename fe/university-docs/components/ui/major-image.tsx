"use client"

import { useEffect, useState } from "react"
import { BookOpen } from "lucide-react"
import { getMajorImage } from "@/lib/api/major"

interface MajorImageProps {
  majorId: number
  majorName: string
  className?: string
}

export function MajorImage({ majorId, majorName, className = "" }: MajorImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const loadImage = async () => {
      try {
        setLoading(true)
        setError(false)
        const url = await getMajorImage(majorId)
        setImageUrl(url)
      } catch (error) {
        console.error("Error loading major image:", error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    loadImage()

    // Cleanup function để revoke blob URL
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl)
      }
    }
  }, [majorId])

  if (loading) {
    return (
      <div className={`bg-muted flex items-center justify-center animate-pulse ${className}`}>
        <BookOpen className="h-16 w-16 text-muted-foreground/50" />
      </div>
    )
  }

  if (error || !imageUrl) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <BookOpen className="h-16 w-16 text-muted-foreground/50" />
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={imageUrl}
        alt={majorName}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        onError={() => setError(true)}
      />
    </div>
  )
} 