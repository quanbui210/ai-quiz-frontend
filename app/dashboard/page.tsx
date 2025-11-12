"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { MessageSquare, Plus } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  
  const displayName = user?.user_metadata?.name || 
                      user?.user_metadata?.full_name || 
                      "User"

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {displayName}!
            </h1>
            <p className="mt-2 text-gray-600">
              Let&apos;s continue your learning journey. Keep up the great work!
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="lg">
              <MessageSquare className="mr-2 h-5 w-5" />
              Chat with AI Tutor
            </Button>
            <Button size="lg" onClick={() => router.push("/topics/new")}>
              <Plus className="mr-2 h-5 w-5" />
              Start New Quiz
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Overall Progress
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">68%</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-green-600">+5% this week</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Topics Mastered
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">5</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-green-600">+1 this week</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Quizzes Taken
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">24</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-green-600">+3 this week</p>
          </div>
        </div>

        {/* Placeholder for future content */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <p className="text-gray-600">
            Your dashboard content will appear here
          </p>
        </div>
      </div>
    </MainLayout>
  )
}

