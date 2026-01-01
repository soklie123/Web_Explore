"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Globe, Lightbulb, BarChart3, Columns3, Users, LogOut } from "lucide-react"

interface AdminSidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function Sidebar({ open, setOpen }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const menuItems = [
    { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Manage Countries", href: "/admin/countries", icon: Globe },
    { label: "Tips & Hints", href: "/admin/tips", icon: Lightbulb },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Compare", href: "/admin/compare", icon: Columns3 },
    { label: "Manage Users", href: "/admin/users", icon: Users },
  ]

  const handleLogout = () => {
    localStorage.removeItem("adminUser")
    router.push("/login")
  }

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${
          open ? "translate-x-0 w-64" : "-translate-x-full w-0 md:w-20"
        } fixed md:relative z-50 h-full bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col shadow-sm`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Globe size={18} />
          </div>
          <h1 className={`font-bold text-slate-800 transition-opacity duration-200 ${!open && "md:opacity-0"}`}>
            AdminPanel
          </h1>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={20} className={isActive ? "text-white" : "text-slate-500"} />
                  <span className={`text-sm font-medium transition-opacity duration-200 ${!open && "md:opacity-0"}`}>
                    {item.label}
                  </span>
                </button>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive bg-transparent"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {open && <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />}
    </>
  )
}
