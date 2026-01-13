"use client"

import { Globe, Sun, Moon, User, LogOut, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { useAuth } from "@/app/auth/hooks/useAuth"
import { auth } from "@/app/auth/lib/firebase"

export default function Navbar() {
  const router = useRouter();
  const { logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Auth state
  const [currentUser, setCurrentUser] = useState<{
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  } | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        })
        setIsAuthenticated(true)
      } else {
        setCurrentUser(null)
        setIsAuthenticated(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/explore" },
    { name: "Favorites", path: "/favorite" },
    { name: "Profile", path: "/profile" },
  ]

  const checkActive = (path: string) => {
    const fromParam = searchParams.get('from')
    if (fromParam){
      if (path === "/") return fromParam === "/"
      return fromParam.startsWith(path)
    }
    if (path === "/") return pathname === "/"
    return pathname.startsWith(path)
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (checkActive(path)) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSignOut = async () => {
    try {
      await logout()
      setProfileMenuOpen(false)
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  // Get user display name or email
  const getUserDisplayName = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName.split(' ')[0] // First name only
    }
    if (currentUser?.email) {
      return currentUser.email.split('@')[0] // Email username
    }
    return "User"
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (currentUser?.displayName) {
      const names = currentUser.displayName.split(' ')
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase()
      }
      return currentUser.displayName[0].toUpperCase()
    }
    if (currentUser?.email) {
      return currentUser.email[0].toUpperCase()
    }
    return "U"
  }

  const activeItem = navItems.find(item => checkActive(item.path)) || navItems[0]
    
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
          <nav className="hidden sm:flex gap-8">
            {navItems.map((item) => {
              const isActive = checkActive(item.path)
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={(e) => handleNavClick(e, item.path)}
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
            className="mr-8 rounded-full hover:bg-gray-200 transition-transform duration-300"
            title="Toggle Theme"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-6 h-6 text-gray-500 transition-transform duration-300" />
            ) : (
              <Moon className="w-6 h-6 text-gray-500 transition-transform duration-300" />
            )}
          </button>   

          {/* Auth Section - Sign In Button or User Profile */}
          {!isAuthenticated ? (
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
          ) : (
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="
                  flex items-center gap-2
                  p-1 pr-3
                  rounded-full
                  hover:bg-gray-200
                  transition-all duration-200
                  active:scale-95
                "
                aria-label="User menu"
              >
                {/* User Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white font-semibold shadow-md">
                  {currentUser?.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt={getUserDisplayName()} 
                      className="w-full h-full rounded-full object-cover" 
                    />
                  ) : (
                    <span className="text-sm">{getUserInitials()}</span>
                  )}
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {getUserDisplayName()}
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {profileMenuOpen && (
                <>
                  {/* Backdrop to close menu when clicking outside */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setProfileMenuOpen(false)}
                  />
                  
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {currentUser?.displayName || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {currentUser?.email || ""}
                      </p>
                    </div>
                    
                    <Link
                      href="/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    
                    <Link
                      href="/settings"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
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
                onClick={(e) => {
                  handleNavClick(e, item.path)
                  setMobileMenuOpen(false)
                }}
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