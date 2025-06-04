"use client"

import { Suspense } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "sonner"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "@/styles/globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })
const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<div>Loading...</div>}>
            <AuthProvider>
              {children}
            </AuthProvider>
          </Suspense>
          <Toaster 
            position="top-center" 
            toastOptions={{
              style: { 
                marginTop: '4rem',
                maxWidth: '500px',
                width: 'auto'
              },
              className: 'toast-center'
            }}
          />
        </QueryClientProvider>
      </body>
    </html>
  )
} 