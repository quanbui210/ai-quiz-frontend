"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { XCircle } from "lucide-react"

export default function SubscriptionCancelPage() {
  const router = useRouter()

  return (
    <MainLayout>
      <div className="mx-auto max-w-2xl py-16">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-red-100 p-4">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Payment Cancelled
          </h1>
          <p className="mb-8 text-lg text-gray-600">
            Your subscription was not completed. No charges were made.
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => router.push("/subscription")} size="lg">
              Try Again
            </Button>
            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              size="lg"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
