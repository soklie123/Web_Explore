"use client"

import { Bell, Settings, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { auth } from "@/app/auth/lib/firebase"

interface AdminHeaderProps {
  adminUser: any
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function AdminHeader({ adminUser, setSidebarOpen }: AdminHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      localStorage.removeItem("authToken")
      localStorage.removeItem("userRole")
      router.push("/auth")
    } catch (error) {
      console.error("Logout error:", error)
      alert("Failed to logout. Please try again.")
    }
  }

  const userName = adminUser.displayName || adminUser.email?.split("@")[0] || "Admin"
  const userEmail = adminUser.email || ""

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setSidebarOpen(prev => !prev)}
        >
          <Menu size={20} />
        </Button>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden sm:flex flex-col items-end mr-2">
          <span className="text-sm font-semibold text-slate-800">{userName}</span>
          <span className="text-xs text-slate-500">{userEmail}</span>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-slate-500 hover:bg-slate-100 rounded-full"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-slate-500 hover:bg-slate-100 rounded-full"
          >
            <Settings size={20} />
          </Button>

          <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />

          <Button
            variant="ghost"
            size="icon"
            className="text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full"
            onClick={handleLogout}
          >
            <LogOut size={20} />
          </Button>
        </div>
      </div>
    </header>
  )
}
