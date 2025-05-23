import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { AuthProvider } from "@/contexts/auth-context"
import MainLayout from "@/components/main-layout"

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
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <MainLayout 
              navbar={<Navbar />}
              footer={<Footer />}
            >
              {children}
            </MainLayout>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
