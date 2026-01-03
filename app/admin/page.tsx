"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem("userRole") // <-- check the stored role
    if (role === "admin") {
      router.push("/admin/dashboard")
    } else if (role === "user") {
      router.push("/user")
    } else {
      router.push("/auth")
    }
  }, [router])

  return null
}
