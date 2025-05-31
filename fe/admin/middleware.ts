import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Tạm thời cho phép tất cả request đi qua
  // Auth check sẽ được thực hiện ở component level (client-side)
  return NextResponse.next()
}
