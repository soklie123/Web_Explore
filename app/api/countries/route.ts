import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch(
      "https://backend-2-igkl.onrender.com/api/countries/detail",
      {
        cache: "no-store",
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch countries" },
        { status: response.status }
      )
    }

    const data = await response.json()

    // If data is already an array, return it
    if (Array.isArray(data)) {
      return NextResponse.json(data)
    }

    // If data is a single object, wrap it in an array
    if (data && typeof data === "object") {
      return NextResponse.json([data])
    }

    // If data is empty or unexpected, return empty array
    return NextResponse.json([])
  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
