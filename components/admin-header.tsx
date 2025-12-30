"use client"

import { Bell, Settings, LogOut, Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface AdminHeaderProps {
  adminUser: { name: string; email: string }
  setSidebarOpen: (open: (prev: boolean) => boolean) => void
}

export function AdminHeader({ adminUser, setSidebarOpen }: AdminHeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("adminUser")
    router.push("/login")
  }

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen((prev) => !prev)}>
          <Menu size={20} />
        </Button>
        <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-1.5 border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <Search size={16} className="text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search countries..."
            className="bg-transparent border-none outline-none text-sm w-48 lg:w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden sm:flex flex-col items-end mr-2">
          <span className="text-sm font-semibold text-slate-800">{adminUser.name}</span>
          <span className="text-xs text-slate-500">{adminUser.email}</span>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <Button variant="ghost" size="icon" className="relative text-slate-500 hover:bg-slate-100 rounded-full">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-500 hover:bg-slate-100 rounded-full">
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
