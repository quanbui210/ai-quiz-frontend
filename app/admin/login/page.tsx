"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/use-auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Loader2, Lock, Mail } from "lucide-react"
import { API_ENDPOINTS } from "@/lib/constants"
import { apiClient } from "@/lib/api/client"

interface EmailPasswordLoginResponse {
  message: string
  user: {
    id: string
    email: string
    name: string
  }
  session: {
    access_token: string
    refresh_token: string
    expires_at: number
  }
  access_token: string
  refresh_token: string
  isAdmin?: boolean
  admin?: {
    role: string
    permissions: string[]
  }
}

export default function AdminLoginPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await apiClient.post<EmailPasswordLoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        {
          email,
          password,
        }
      )

      const data = response.data

      const expiresAt = data.session?.expires_at
      const expiresIn = expiresAt
        ? Math.floor((expiresAt * 1000 - Date.now()) / 1000)
        : 3600

      setAuth({
        message: data.message || "Login successful",
        user: data.user as any,
        session: {
          access_token: data.session?.access_token || data.access_token,
          refresh_token: data.session?.refresh_token || data.refresh_token,
          expires_at: expiresAt || Math.floor(Date.now() / 1000) + expiresIn,
          expires_in: expiresIn,
          token_type: "Bearer",
          user: data.user as any,
        },
        isAdmin: data.isAdmin,
        admin: data.admin,
      })

      setIsCheckingAdmin(true)

      if (data.isAdmin) {
        router.push("/admin/dashboard")
      } else {
        setError("You do not have admin privileges")
        setIsCheckingAdmin(false)
      }
    } catch (err: any) {
      console.error("Login error:", err)
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Invalid email or password"
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in with your admin credentials
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading || !email || !password}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-5 w-5" />
                Sign In
              </>
            )}
          </Button>
        </form>

        <div className="text-center">
          <a
            href="/login"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Regular user login →
          </a>
        </div>
      </div>
    </div>
  )
}
