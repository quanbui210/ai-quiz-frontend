"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading, isAdmin } = useAuth()
  const hasRedirectedRef = useRef(false)

  useEffect(() => {
    if (!isLoading && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true
      if (!isAuthenticated) {
        router.push("/login")
      } else if (isAdmin) {
        router.push("/admin/dashboard")
      }
    }
  }, [isAuthenticated, isLoading, isAdmin, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || isAdmin) {
    return null
  }

  return <>{children}</>
}
