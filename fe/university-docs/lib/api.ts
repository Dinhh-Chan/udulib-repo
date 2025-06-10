import { Major, Subject, Document } from "@/types"

export async function fetchMajors(): Promise<Major[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/majors/`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  return res.json()
}

export async function fetchSubjects(majorId: number, yearId: number): Promise<Subject[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subjects?major_id=${majorId}&year_id=${yearId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  return res.json()
}

export async function fetchDocumentCount(subjectId: number): Promise<number> {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/public?subject_id=${subjectId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  const data = await res.json()
  return Array.isArray(data.documents) ? data.documents.length : 0
}

export async function fetchSubject(subjectId: string): Promise<Subject> {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subjects/${subjectId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  return res.json()
}

export async function fetchMajor(majorId: string): Promise<Major> {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/majors/${majorId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  return res.json()
}

export async function fetchDocuments(subjectId: string): Promise<Document[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/public?subject_id=${subjectId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  const data = await res.json()
  return Array.isArray(data.documents) ? data.documents : []
} 