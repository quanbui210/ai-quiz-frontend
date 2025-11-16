"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { useSubscription } from "@/hooks/use-subscription"
import { CheckCircle2, Loader2 } from "lucide-react"

export default function SubscriptionSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const { subscription, refetch, isLoading } = useSubscription()
  const [isVerifying, setIsVerifying] = useState(true)

  useEffect(() => {
    if (sessionId) {
      const verifySubscription = async () => {
        await refetch()
        setIsVerifying(false)
      }
      verifySubscription()
    } else {
      setIsVerifying(false)
    }
  }, [sessionId, refetch])

  if (isVerifying || isLoading) {
    return (
      <MainLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-2xl py-16">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Subscription Successful!
          </h1>
          <p className="mb-8 text-lg text-gray-600">
            Your subscription to <strong>{subscription?.plan.name}</strong> has been
            activated successfully.
          </p>
          <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Your New Limits
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-gray-600">Topics</p>
                <p className="text-2xl font-bold text-gray-900">
                  {subscription?.maxTopics || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Quizzes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {subscription?.maxQuizzes || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Documents</p>
                <p className="text-2xl font-bold text-gray-900">
                  {subscription?.maxDocuments || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <Button onClick={() => router.push("/dashboard")} size="lg">
              Go to Dashboard
            </Button>
            <Button
              onClick={() => router.push("/subscription")}
              variant="outline"
              size="lg"
            >
              View Plans
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

