"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import {
  Brain,
  MessageSquare,
  FileText,
  TrendingUp,
  Zap,
  Check,
  ArrowRight,
  BookOpen,
  Heart,
} from "lucide-react"

export default function FeaturesPage() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Show header when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsHeaderVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const handleGetStarted = () => {
    window.location.href = "/login"
  }

  const mainFeatures = [
    {
      icon: FileText,
      title: "Instant Quizzes",
      description:
        "Generate personalized quizzes from any topic instantly. Our AI creates questions tailored to your learning style and difficulty level.",
      details: [
        "AI-powered question generation",
        "Multiple difficulty levels",
        "Customizable quiz length",
        "Instant feedback and explanations",
        "Progress tracking",
      ],
      image: "/images/features/quiz.png",
    },
    {
      icon: MessageSquare,
      title: "AI Tutor",
      description:
        "Get instant help and explanations from your AI learning assistant using RAG (Retrieval-Augmented Generation) technology. Ask questions, get clarifications, and deepen your understanding anytime with accurate, context-aware responses.",
      details: [
        "Real-time chat interface",
        "RAG-powered accurate responses",
        "Context-aware explanations",
        "Step-by-step guidance",
        "Multi-language support",
        "Conversation history",
      ],
      image: "/images/features/Chat with AI tutor.png",
    },
    {
      icon: FileText,
      title: "Learn from Your Docs",
      description:
        "Upload your documents (PDFs, text files, etc.) and automatically generate personalized quizzes based on the content. Our AI uses RAG (Retrieval-Augmented Generation) technique to analyze your document, extract key concepts, and create relevant questions to help you master the material. Transform your study materials into interactive learning experiences.",
      details: [
        "PDF, DOCX, and text file support",
        "Automatic content extraction",
        "Smart quiz generation using RAG",
        "Key concept highlighting",
        "Document-based learning paths",
        "Continue chat with AI tutor about documents",
      ],
      image: "/images/features/quiz-from-docs.png",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description:
        "Monitor your improvement with detailed analytics. See your strengths, identify areas for improvement, and track your learning journey.",
      details: [
        "Performance analytics",
        "Time tracking",
        "Topic mastery levels",
        "Weekly progress reports",
        "Visual progress charts",
      ],
      image: "/images/features/analytics.png",
    },
  ]

  const additionalFeatures = [
    {
      icon: Zap,
      title: "Fast & Efficient",
      description: "Get instant results with our optimized AI processing",
    },
    {
      icon: BookOpen,
      title: "Multiple Topics",
      description: "Learn across various subjects and domains",
    },
    {
      icon: Brain,
      title: "Adaptive Learning",
      description: "AI adapts to your learning pace and style",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white transition-transform duration-300 ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
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
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="/features"
                className="text-sm font-medium text-blue-600"
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
                onClick={() => (window.location.href = "/login")}
                className="hidden sm:flex"
              >
                Log In
              </Button>
              <Button
                onClick={handleGetStarted}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Sign Up for Free
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white via-blue-50/30 to-gray-50 px-4 pt-32 pb-20 sm:px-6 sm:pt-24 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold text-gray-900 sm:text-6xl">
            Powerful Features for{" "}
            <span className="bg-gradient-to-r from-blue-700 to-blue-400 bg-clip-text text-transparent">
              Effective Learning
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
            Discover all the tools and capabilities that make QuizzAI the
            perfect learning companion for students and professionals.
          </p>
        </div>
      </section>

      {/* Main Features */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-20">
            {mainFeatures.map((feature, index) => (
              <div
                key={index}
                className={`grid items-center gap-12 ${
                  index % 2 === 0
                    ? "lg:grid-cols-2"
                    : "lg:grid-cols-2"
                }`}
              >
                <div
                  className={
                    index % 2 === 1 ? "lg:order-2" : ""
                  }
                >
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl border-2 border-blue-200 bg-blue-50">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h2 className="mb-4 text-4xl font-bold text-gray-900">
                    {feature.title}
                  </h2>
                  <p className="mb-6 text-xl text-gray-600">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className={`hidden lg:block ${
                    index % 2 === 1 ? "lg:order-1" : ""
                  }`}
                >
                  {feature.image ? (
                    <div className="relative h-[400px] w-full overflow-hidden rounded-2xl border border-gray-200 bg-white">
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 1024px) 0vw, 50vw"
                      />
                    </div>
                  ) : (
                    <div className="relative h-[400px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200">
                      <div className="flex h-full items-center justify-center">
                        <feature.icon className="h-32 w-32 text-blue-600 opacity-20" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="bg-gradient-to-br from-gray-50 via-white to-blue-50/20 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              And So Much More
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Additional features that enhance your learning experience
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {additionalFeatures.map((feature, index) => (
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

      {/* CTA Section */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            Ready to Get Started?
          </h2>
          <p className="mb-8 text-xl text-gray-600">
            Join thousands of learners already using QuizzAI
          </p>
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Get Started for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
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
              © 2025 QuizzAI. All rights reserved. Built by Quan Bui{" "}
              <Heart className="inline h-4 w-4 text-red-500" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

