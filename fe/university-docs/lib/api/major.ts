import { Major, MajorCreate, MajorUpdate } from "@/types/major"
import { getAuthToken } from "./auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL

const getHeaders = () => {
  const token = getAuthToken()
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

export async function getMajors(page: number = 1, perPage: number = 20): Promise<Major[]> {
  const response = await fetch(`${API_URL}/majors?page=${page}&per_page=${perPage}`, {
    headers: getHeaders()
  })
  if (!response.ok) {
    throw new Error("Failed to fetch majors")
  }
  return response.json()
}

export async function getMajor(id: number): Promise<Major> {
  const response = await fetch(`${API_URL}/majors/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch major")
  }
  return response.json()
}

export async function createMajor(major: MajorCreate): Promise<Major> {
  try {
    const response = await fetch(`${API_URL}/majors/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(major),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.message || "Failed to create major")
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error("Failed to create major")
  }
}

export async function updateMajor(id: number, major: MajorUpdate): Promise<Major> {
  try {
    const response = await fetch(`${API_URL}/majors/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(major),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.message || "Failed to update major")
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error("Failed to update major")
  }
}

export async function deleteMajor(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/majors/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.message || "Failed to delete major")
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error("Failed to delete major")
  }
}

export async function getMajorImage(majorId: number): Promise<string> {
  const token = getAuthToken()
  const response = await fetch(`${API_URL}/majors/image?major_id=${majorId}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })
  
  if (!response.ok) {
    throw new Error("Failed to fetch major image")
  }
  
  // Tạo blob URL để hiển thị ảnh
  const blob = await response.blob()
  return URL.createObjectURL(blob)
}

export async function getMajorImageUrl(majorId: number): Promise<string> {
  const token = getAuthToken()
  const response = await fetch(`${API_URL}/majors/image-url?major_id=${majorId}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })
  
  if (!response.ok) {
    throw new Error("Failed to fetch major image URL")
  }
  
  const data = await response.json()
  return data.image_url
} 