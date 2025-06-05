import Link from "next/link"
import { Inter } from "next/font/google"


const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})
export default function NotFound() {
  return (
    <div className={`${inter.className} antialiased`}>
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center px-4" >
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 mt-4">Không tìm thấy trang</h2>
        <p className="text-gray-600 mt-2 mb-8">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Quay về trang chủ
        </Link>
      </div>
    </div>
    </div>
  )
} 