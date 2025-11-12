import { NextRequest, NextResponse } from "next/server"
import { API_ENDPOINTS } from "@/lib/constants"

export async function POST(request: NextRequest) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    const body = await request.json()

    // Forward Authorization header from the request
    const authHeader = request.headers.get("Authorization")

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (authHeader) {
      headers.Authorization = authHeader
    }

    const backendUrl = `${apiUrl}${API_ENDPOINTS.TOPIC.CREATE}`

    const response = await fetch(backendUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: "Failed to create topic", details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Topic create proxy error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

