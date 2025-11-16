"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

interface ProtectedAdminRouteProps {
  children: React.ReactNode
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading, isAdmin } = useAuth()
  const hasRedirectedRef = useRef(false)

  useEffect(() => {
    if (!isLoading && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true
      if (!isAuthenticated) {
        router.push("/admin/login")
      } else if (!isAdmin) {
        router.push("/dashboard")
      }
    }
  }, [isAuthenticated, isLoading, isAdmin, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></Loader2>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in. Redirecting...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Access denied. Redirecting...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

