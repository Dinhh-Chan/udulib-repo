"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { requestPasswordReset } from "@/lib/api/password-reset"
import { AuthContainer } from "@/components/ui/auth-container"
import { motion } from "framer-motion"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await requestPasswordReset(email)
      toast.success("Vui lòng kiểm tra email của bạn để lấy mật khẩu mới", {
        duration: 10000,
        position: "top-center"
      })
      router.push("/login")
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContainer
      title="Quên mật khẩu"
      subtitle="Nhập email của bạn để lấy mật khẩu mới"
    >
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              id="email"
              name="email"
              type="email"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
              placeholder="Email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200"
          >
            {isLoading ? "Đang xử lý..." : "Gửi yêu cầu"}
          </motion.button>
        </div>

        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => router.push("/login")}
            className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
          >
            Quay lại đăng nhập
          </motion.button>
        </div>
      </form>
    </AuthContainer>
  )
} 