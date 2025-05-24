import { Major, MajorCreate, MajorUpdate } from "@/types/major"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getMajors(): Promise<Major[]> {
  const response = await fetch(`${API_URL}/majors`)
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