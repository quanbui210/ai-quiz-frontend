"use client"

import { Suspense, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useAuthStore } from "@/stores/use-auth-store"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import {
  Chrome,
  Brain,
  MessageSquare,
  FileText,
  TrendingUp,
  ArrowRight,
  Check,
  BookOpen,
  Zap,
  Heart,
} from "lucide-react"
import userStories from "@/lib/data/user-stories.json"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Brain,
  Zap,
  TrendingUp,
}

function LandingPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, handleCallback, isAuthenticated, isLoading, isAdmin } =
    useAuth()
  const setLoading = useAuthStore((state) => state.setLoading)
  const hasRedirectedRef = useRef(false)

  useEffect(() => {
    const code = searchParams.get("code")
    const error = searchParams.get("error")

    if (error) {
      console.error("OAuth error:", error)
      setLoading(false)
    } else if (code) {
      handleCallback(code)
    } else {
      if (isLoading && !isAuthenticated) {
        const timer = setTimeout(() => {
          if (window.location.pathname === "/") {
            setLoading(false)
          }
        }, 2000)
        return () => clearTimeout(timer)
      }
    }
  }, [searchParams, handleCallback, isLoading, isAuthenticated, setLoading])

  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true
        if (isAdmin) {
          router.push("/admin/dashboard")
        } else {
          router.push("/dashboard")
      }
    }
  }, [isAuthenticated, isLoading, isAdmin, router])

  if (isLoading) {
  return (
      <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
    )
  }

  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  const handleGoogleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    try {
      await login()
    } catch (error) {
      console.error("Login handler error:", error)
      alert("Failed to initiate login. Please check the console for details.")
    }
  }

  const handleGetStarted = () => {
    handleGoogleLogin({ preventDefault: () => {} } as any)
  }

  const handleLogin = () => {
    handleGoogleLogin({ preventDefault: () => {} } as any)
  }

  const features = [
    {
      icon: FileText,
      title: "Instant Quizzes",
      description:
        "Generate personalized quizzes from any topic instantly. Our AI creates questions tailored to your learning style and difficulty level.",
    },
    {
      icon: MessageSquare,
      title: "AI Tutor",
      description:
        "Get instant help and explanations from your AI learning assistant. Ask questions, get clarifications, and deepen your understanding anytime.",
    },
    {
      icon: FileText,
      title: "Learn from Your Docs",
      description:
        "Upload any document and generate quizzes automatically. Transform your study materials into interactive learning experiences.",
    },
  ]


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-gray-200">
                <Image
                  src="/icons/icon.svg"
                  alt="QuizzAI Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-semibold text-gray-900">
                QuizzAI
              </span>
            </div>

            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="/features"
                className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
              >
                Pricing
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={handleLogin}
                className="hidden sm:flex"
                disabled={isLoading}
              >
                Log In
              </Button>
              <Button
                onClick={handleGetStarted}
                disabled={isLoading}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {isLoading ? "Signing in..." : "Sign Up for Free"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-gray-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <h1 className="mb-6 text-5xl font-bold text-gray-900 sm:text-6xl">
                Unlock Deeper Understanding with Your{" "}
                <span className="bg-gradient-to-r from-blue-700 to-blue-400 bg-clip-text text-transparent">
                  Personal AI Tutor
                </span>
              </h1>
              <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600 lg:mx-0">
                Generate quizzes, chat with an AI tutor, and now, learn directly
                from your own documents.
              </p>
              <div className="flex justify-center lg:justify-start">
                <Button
                  onClick={handleGetStarted}
                  size="lg"
                  disabled={isLoading}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  {isLoading ? "Signing in..." : "Get Started for Free"}
                  {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative h-[500px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 shadow-2xl p-8">
                <div className="flex h-full flex-col justify-center text-white">
                  <div className="mb-6 text-center">
                    <Brain className="mx-auto mb-4 h-16 w-16" />
                    <h2 className="mb-3 text-2xl font-bold">
                      Transform Your Learning Journey
                    </h2>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
                        <Check className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold">AI-Generated Quizzes</p>
                        <p className="text-sm text-blue-100">
                          Create personalized quizzes from any topic instantly
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
                        <Check className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold"> AI Tutor</p>
                        <p className="text-sm text-blue-100">
                          Get instant help and explanations anytime you need
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
                        <Check className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold">Learn from Documents</p>
                        <p className="text-sm text-blue-100">
                          Upload PDFs and generate quizzes automatically
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
                        <Check className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold">Track Your Progress</p>
                        <p className="text-sm text-blue-100">
                          Monitor improvement with detailed analytics
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              How Our AI Empowers Your Learning
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Discover a smarter way to study and comprehend any subject with
              our suite of AI-powered tools.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-white p-8 shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg border-2 border-blue-200 bg-blue-50">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Stories Section */}
      <section className="bg-gradient-to-br from-gray-50 via-white to-blue-50/20 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Trusted by Students and Professionals
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              See how QuizzAI is transforming lives and opening new
              opportunities
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {userStories.map((story) => {
              const IconComponent = iconMap[story.icon] || BookOpen
              return (
                <div
                  key={story.id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  <div
                    className={`h-80 bg-gradient-to-br ${story.gradient} relative flex items-center justify-center overflow-hidden`}
                  >
                    <img
                      src={story.image}
                      alt={story.imageAlt}
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                        const placeholder = target.parentElement
                        if (placeholder) {
                          placeholder.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center">
                              <div class="text-center">
                                <div class="w-24 h-24 bg-white/80 rounded-full mx-auto mb-2 flex items-center justify-center">
                                  <svg class="h-12 w-12 ${story.iconColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <p class="text-xs text-gray-500">Image placeholder</p>
                              </div>
                            </div>
                          `
                        }
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="mb-3 flex items-center gap-2">
                     
                 
                    </div>
                    <p className="text-sm leading-relaxed text-gray-700">
                      &quot;{story.story}&quot;
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-gray-200">
                  <Image
                    src="/icons/icon.svg"
                    alt="QuizzAI Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <span className="font-semibold text-gray-900">QuizzAI</span>
              </div>
              <p className="text-sm text-gray-600">
                Your personal AI-powered learning companion.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-gray-900">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="mailto:quanbui021001@gmail.com"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-gray-900">Follow Us</h3>
              <div className="flex gap-4">
                <a
                  href="https://www.linkedin.com/in/quan-bui-0a4908209/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8 text-center">
            <p className="text-sm text-gray-600">
            © 2025 QuizzAI. All rights reserved. By Quan Bui{" "}   
            </p>
            <p className="text-sm text-gray-600">By Quan Bui{" "} <Heart className="inline h-4 w-4 text-red-500" /></p> 
          </div>
      </div>
      </footer>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <LandingPageContent />
    </Suspense>
  )
}
