"use client"

import { Search, Globe } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export default function Navbar() {
  const [searchFocused, setSearchFocused] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { name: "Home", path: "/user" },
    { name: "Explore", path: "/user/explore" },
    { name: "Favorites", path: "/user/favorite" },
    { name: "Profile", path: "/user/profile" },
  ]

  const checkActive = (path: string) => {
    if (path === "/user") return pathname === "/user"
    return pathname.startsWith(path)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
  <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-2">

        {/* LOGO */}
        <Link href="/user" className="flex items-center gap-2">
          <Globe className="w-8 h-8 text-sky-600" />
          <span
            className="
              transition-all duration-300 ease-in-out
              opacity-0 translate-x-2 w-0
              sm:opacity-100 sm:translate-x-0 sm:w-auto
              font-semibold text-lg
              bg-gradient-to-r from-blue-600 to-emerald-500
              bg-clip-text text-transparent
              whitespace-nowrap
              pr-8
            "
          >
            CountryExplorer
          </span>
        </Link>

        {/* NAVIGATION */}
        <nav className="flex gap-8">
          {navItems.map((item) => {
            const isActive = checkActive(item.path)

            return (
              <Link
                key={item.name}
                href={item.path}
                className={`relative group text-sm font-medium py-2 transition-colors ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-400"
                }`}
              >
                {item.name}
                <span
                  className={`absolute left-0 bottom-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            )
          })}
        </nav>

        {/* SEARCH */}
        <div className="w-64 pl-4">
          <div
            className={`flex items-center rounded-md px-3 py-1.5 transition-all ${
              searchFocused
                ? "bg-white ring-2 ring-sky-500 shadow-sm"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              placeholder="Search countries..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
            />
          </div>
        </div>

      </div>
    </header>
  )
}
