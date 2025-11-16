"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, isLoading, isAdmin } = useAuth()
  const hasRedirectedRef = useRef(false)

  useEffect(() => {
    if (!isLoading && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true
      if (isAuthenticated) {
        if (isAdmin) {
          router.push("/admin/dashboard")
        } else {
          router.push("/dashboard")
        }
      } else {
        router.push("/login")
      }
    }
  }, [isAuthenticated, isLoading, isAdmin, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
