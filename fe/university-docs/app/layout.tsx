import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "sonner"

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Hệ Thống Quản Lý Tài liệu Học tập",
  description: "Hệ thống lưu trữ và quản lý tài liệu học tập cho các ngành học của trường đại học",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <Toaster position="top-center" richColors />
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <div className="flex-1 flex flex-col">
                <div className="container mx-auto px-2 sm:px-6 lg:px-8 max-w-[1400px] w-full flex-1">
                  <main className="flex-1  min-h-0">
                    {children}
                  </main>
                </div>
              </div>
              <Footer />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
