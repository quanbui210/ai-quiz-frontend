"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Sparkles, Loader2 } from "lucide-react"
import { Topic } from "@/types/prisma"

export default function TopicPage() {
  const params = useParams()
  const router = useRouter()
  const topicId = params.id as string
  const [topic, setTopic] = useState<Topic | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!topicId) return

    const fetchTopic = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const authData = localStorage.getItem("auth-storage")
        let authToken: string | null = null
        if (authData) {
          try {
            const parsed = JSON.parse(authData)
            authToken = parsed?.state?.session?.access_token || null
          } catch {
          }
        }

        const headers: HeadersInit = {
          "Content-Type": "application/json",
        }

        if (authToken) {
          headers.Authorization = `Bearer ${authToken}`
        }

        const response = await fetch(`/api/topic/${topicId}`, {
          method: "GET",
          headers,
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({
            error: "Failed to get topic",
          }))
          throw new Error(errorData.error || errorData.details || "Failed to get topic")
        }

        const data = await response.json()
        setTopic(data.topic)
      } catch (err) {
        console.error("Failed to fetch topic:", err)
        setError(err instanceof Error ? err.message : "Failed to load topic")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTopic()
  }, [topicId])

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading topic...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error || (!isLoading && !topic)) {
    return (
      <MainLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">
              {error || "Topic not found"}
            </p>
            <Button onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!topic) {
    return null
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{topic.name}</h1>
            {topic.description && (
              <p className="mt-2 text-gray-600">{topic.description}</p>
            )}
          </div>
        </div>

        {/* Topic Content */}
        <div className="rounded-lg bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Topic Information
            </h2>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Created</p>
              <p className="text-sm text-gray-900">
                {new Date(topic.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Start Generate Quiz Section */}
          <div className="mt-8 pt-6 border-t">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Sparkles className="h-5 w-5" />
                <p className="text-base font-medium">
                  Ready to test your knowledge?
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Generate a personalized quiz based on this topic
              </p>
              <Button
                size="lg"
                onClick={() => {
                  // TODO: Navigate to quiz generation page
                  console.log("Generate quiz for topic:", topic.id)
                }}
                className="mt-4"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Start Generate Quiz
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

