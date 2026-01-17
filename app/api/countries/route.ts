import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const revalidate = 300 // Cache for 5 minutes

export async function GET() {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000)

    const response = await fetch(
      "https://backend-2-igkl.onrender.com/api/countries/detail",
      {
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 300 }, // ✓ Cache for 5 minutes
        signal: controller.signal,
      }
    )

    clearTimeout(timeoutId)

    if (!response.ok) {
      return NextResponse.json(
        { error: `API error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    })
  } catch (error: any) {
    if (error?.name === "AbortError") {
      return NextResponse.json(
        { error: "Request timeout - backend API is slow" },
        { status: 504 }
      )
    }

    return NextResponse.json(
      { error: "Failed to fetch countries data" },
      { status: 500 }
    )
  }
}