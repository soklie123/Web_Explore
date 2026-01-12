"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { Sidebar } from "./admin-sidebar"
import { AdminHeader } from "./admin-header"
import { auth, db } from "@/app/auth/lib/firebase"

interface AdminLayoutProps {
  children: React.ReactNode
}

interface AdminUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  role: string
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      if (!user) {
        // Not logged in - redirect to auth page
        router.push("/auth")
        return
      }

      try {
        // Check user role from Firestore
        const docRef = doc(db, "users", user.uid)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const role = (docSnap.data()?.role as string)?.trim().toLowerCase()
          
          if (role === "admin") {
            // User is admin - set admin user data
            setAdminUser({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              role: role
            })
            setLoading(false)
          } else {
            // User is logged in but not admin - redirect to home
            router.push("/")
          }
        } else {
          // No user document found - redirect to home
          router.push("/")
        }
      } catch (error) {
        console.error("Error checking admin role:", error)
        router.push("/")
      }
    })

    return () => unsubscribe()
  }, [router])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authorized (will redirect)
  if (!adminUser) {
    return null
  }

  // Only render when we have a confirmed admin user
  return adminUser ? (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50/50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader adminUser={adminUser} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  ) : null
}