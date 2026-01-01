"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const adminUser = localStorage.getItem("adminUser")
    if (adminUser) {
      router.push("/admin/dashboard")
    } else {
      router.push("/login")
    }
  }, [router])

  return null
}
