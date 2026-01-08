"use client"

import { Globe, Sun, Moon } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

export default function Navbar() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/explore" },
    { name: "Favorites", path: "/favorite" },
    { name: "Profile", path: "/profile" },
  ]

  const checkActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname.startsWith(path)
  }

 const activeItem =
    navItems.find(item => checkActive(item.path)) || navItems[0]
    
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 transition-colors">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-2">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <Globe className="w-8 h-8 text-sky-600" />
          <span className="hidden sm:block font-semibold text-lg bg-gradient-to-r 
                      from-blue-600 to-emerald-500 bg-clip-text text-transparent 
                      whitespace-nowrap transition-all duration-300">
            ExploreVista
          </span>
        </Link>

        {/* Center Nav */}
        <div className="flex items-center flex-1 justify-center sm:pl-12">
          {/* Desktop Nav */}
          <nav className="hidden sm:flex gap-8">
            {navItems.map((item) => {
              const isActive = checkActive(item.path)
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`relative group text-sm font-medium py-2 transition-colors ${
                    isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
            {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="
              sm:hidden
              flex items-center gap-1
              px-2 py-1
              text-sm font-medium text-gray-700
              rounded-md
              hover:bg-gray-200
              transition
            "
          >
            {activeItem.name}
            <span
              className={`pi pi-angle-down transition-transform duration-200 ${
                mobileMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dark/Light Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 transition-transform duration-300"
            title="Toggle Theme"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-gray-500 transition-transform duration-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-500 transition-transform duration-300" />
            )}
          </button>   
          <button
                onClick={() => router.push("/auth")}
                type="button"
                className="
                  flex items-center justify-center
                  px-6 py-3
                  rounded-full
                  text-sm font-semibold text-white
                  bg-gradient-to-r from-blue-600 to-teal-500
                  hover:from-teal-500 hover:to-blue-600
                  transition-transform duration-300 ease-in-out
                  shadow-md hover:shadow-lg
                  active:scale-95
                "
          >
            Sign In
          </button>       
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`sm:hidden bg-white border-t border-gray-200 overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-96 opacity-100 py-2' : 'max-h-0 opacity-0 py-0'
        }`}
      >
        <nav className="flex flex-col gap-2 p-2">
          {navItems.map((item) => {
            const isActive = checkActive(item.path)
            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-md transition-colors ${
                  isActive ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}