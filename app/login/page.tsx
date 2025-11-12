"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Chrome } from "lucide-react"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { login, handleCallback, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    // Handle OAuth callback
    const code = searchParams.get("code")
    const error = searchParams.get("error")

    if (error) {
      console.error("OAuth error:", error)
      // You can show an error message here
    } else if (code) {
      handleCallback(code)
    }
  }, [searchParams, handleCallback])

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const handleGoogleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log("Button clicked, initiating login...")
    try {
      await login()
    } catch (error) {
      console.error("Login handler error:", error)
      // You could show a toast/alert here
      alert("Failed to initiate login. Please check the console for details.")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">
            <span className="text-3xl font-bold text-white">L</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome to LearnAI
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue your learning journey
          </p>
        </div>

        <div className="mt-8 rounded-lg bg-white px-6 py-8 shadow-sm">
          <div className="space-y-4">
            <p className="text-center text-sm text-gray-600">
              Sign in with your Google account to get started
            </p>

            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              size="lg"
            >
              <Chrome className="mr-2 h-5 w-5" />
              {isLoading ? "Signing in..." : "Sign in with Google"}
            </Button>

            <p className="text-center text-xs text-gray-500">
              By signing in, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            New to LearnAI?{" "}
            <span className="font-medium text-blue-600">
              Signing in will create your account
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

