"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Check, Zap, Crown, Sparkles, ArrowRight, Heart } from "lucide-react"

export default function PricingPage() {
  const handleGetStarted = () => {
    window.location.href = "/login"
  }

  const plans = [
    {
      name: "Free",
      icon: null,
      price: "€0",
      pricePerMonth: null,
      yearlyPrice: null,
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "5 topics",
        "12 quizzes",
        "3 documents",
        "AI Models: gpt-3.5-turbo",
      ],
      buttonText: "Get Started Free",
      popular: false,
    },
    {
      name: "Pro",
      icon: Zap,
      price: "€2.08",
      pricePerMonth: 2.08,
      yearlyPrice: 25.0,
      period: "per month",
      description: "For serious learners",
      features: [
        "50 topics",
        "200 quizzes",
        "20 documents",
        "AI Models: gpt-3.5-turbo, gpt-4-turbo",
      ],
      buttonText: "Start Pro Trial",
      popular: true,
    },
    {
      name: "Premium",
      icon: Crown,
      price: "€8.33",
      pricePerMonth: 8.33,
      yearlyPrice: 100.0,
      period: "per month",
      description: "For professionals and teams",
      features: [
        "200 topics",
        "1,000 quizzes",
        "50 documents",
        "AI Models: gpt-3.5-turbo, gpt-4-turbo, gpt-4o",
      ],
      buttonText: "Start Premium",
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
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
                className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium text-blue-600"
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
      <section className="bg-gradient-to-br from-white via-blue-50/30 to-gray-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold text-gray-900 sm:text-6xl">
            Simple, Transparent{" "}
            <span className="bg-gradient-to-r from-blue-700 to-blue-400 bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
            Choose the plan that works best for you. All plans include our core
            features with no hidden fees.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative flex flex-col rounded-2xl border-2 p-8 transition-all duration-300 ${
                  plan.popular
                    ? "border-blue-500 bg-white shadow-xl"
                    : "border-gray-200 bg-white shadow-md hover:shadow-lg"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  {plan.icon ? (
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-blue-700">
                        <plan.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {plan.name}
                      </h3>
                    </div>
                  ) : (
                    <h3 className="mb-4 text-2xl font-bold text-gray-900">
                      {plan.name}
                    </h3>
                  )}
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    {plan.period !== "forever" && (
                      <span className="ml-2 text-gray-600">
                        /{plan.period}
                      </span>
                    )}
                  </div>
                  {plan.yearlyPrice && (
                    <p className="mb-1 text-sm text-gray-500">
                      €{plan.yearlyPrice.toFixed(2)} per year, billed yearly
                    </p>
                  )}
                  <p className="text-sm text-gray-600">{plan.description}</p>
                </div>

                <ul className="mb-8 flex-1 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={handleGetStarted}
                  className={`mt-auto w-full ${
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                  size="lg"
                >
                  {plan.buttonText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gradient-to-br from-gray-50 via-white to-blue-50/20 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Can I change plans later?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes
                will be reflected in your next billing cycle.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards and PayPal. All payments are
                processed securely through Stripe.
              </p>
            </div>

            {/* <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes! All paid plans come with a 14-day free trial. No credit
                card required to start.
              </p>
            </div> */}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            Ready to Start Learning?
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

