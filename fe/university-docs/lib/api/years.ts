import { Year, YearCreate, YearUpdate } from "@/types/year"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getYears(): Promise<Year[]> {
  try {
    const response = await fetch(`${API_URL}/academic-years`)
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Không thể lấy danh sách năm học")
    }
    const data = await response.json()
    // Đảm bảo dữ liệu trả về đúng format
    return data.map((year: any) => ({
      ...year,
      year_order: year.year_order || 1,
      created_at: year.created_at || new Date().toISOString(),
      updated_at: year.updated_at || null
    }))
  } catch (error) {
    console.error("Error fetching years:", error)
    throw error
  }
}

export async function getYear(id: number): Promise<Year> {
  try {
    const response = await fetch(`${API_URL}/academic-years/${id}`)
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Không thể lấy thông tin năm học")
    }
    const data = await response.json()
    return {
      ...data,
      year_order: data.year_order || 1,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || null
    }
  } catch (error) {
    console.error("Error fetching year:", error)
    throw error
  }
}

export async function createYear(data: YearCreate): Promise<Year> {
  try {
    const response = await fetch(`${API_URL}/academic-years`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        year_order: data.year_order || 1
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Không thể thêm năm học")
    }

    return response.json()
  } catch (error) {
    console.error("Error creating year:", error)
    throw error
  }
}

export async function updateYear(id: number, data: YearUpdate): Promise<Year> {
  try {
    const response = await fetch(`${API_URL}/academic-years/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        year_order: data.year_order || 1
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Không thể cập nhật năm học")
    }

    return response.json()
  } catch (error) {
    console.error("Error updating year:", error)
    throw error
  }
}

export async function deleteYear(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/academic-years/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Không thể xóa năm học")
    }
  } catch (error) {
    console.error("Error deleting year:", error)
    throw error
  }
} 