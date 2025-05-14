"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MessageSquare, User, ChevronDown } from "react-feather"
import { useLogoutMutation } from "@/store/api/authApi"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store"
import { Briefcase } from "lucide-react"
import ProtectedRoute from "../global/ProtectedRoute"
import { clearCurrentUser } from "@/store/slices/userSlice"

interface NavbarProps {
  messageCount?: number
  requireAuth?: boolean
}

export default function Navbar({ messageCount = 0, requireAuth = false }: NavbarProps) {
  const router = useRouter()
  const dispatch = useDispatch()
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const isAuthenticated = useSelector((state: RootState) => state.user?.isAuthenticated)
  const currentUser = useSelector((state: RootState) => state.user?.currentUser)
  const user = currentUser
  const isLoading = false
  const displayName = user?.full_name || user?.company_name || "Account"
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [userMenuRef])

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      setIsUserMenuOpen(false)
      dispatch(clearCurrentUser())
      localStorage.removeItem("userType")
      window.location.href = "/landing-page"
    } catch (error) {
      // console.error("Logout failed:", error)
      dispatch(clearCurrentUser())
      localStorage.removeItem("userType")
      window.location.href = "/landing-page"
    }
  }

  const isUserAuthenticated = isAuthenticated
  const renderNavbarContent = () => (
    <nav className="bg-white">
      <div className="max-w-7xl mx-auto px-4 ">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 cursor-pointer flex items-center">
              <Briefcase className="h-10 w-10 mr-2 text-[#D49F2E]" />
              <span className="text-xl ml-2 sm:block hidden font-bold text-black">Jay Constructions</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-t-[#D49F2E] border-r-transparent border-b-[#D49F2E] border-l-transparent rounded-full animate-spin"></div>
            ) : isUserAuthenticated ? (
              <>
                <Link
                  href="/chat"
                  className="flex items-center px-3 py-1.5 text-[#D49F2E] hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MessageSquare size={20} className="mr-1" />
                  <span className="text-sm font-medium">Chat</span>
                </Link>
                <div className="relative" ref={userMenuRef}>
                  <button
                    className="flex items-center cursor-pointer text-[#D49F2E] focus:outline-none"
                    onClick={() => {
                      setIsUserMenuOpen(!isUserMenuOpen)
                    }}
                    aria-label="User menu"
                  >
                    <User size={20} className="mr-1" />
                    <span className="text-sm text-[#D49F2E] font-medium">{displayName}</span>
                    <ChevronDown size={16} className="ml-1" />
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-6 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                      <Link href="/profile" className="block px-4 py-2 text-sm text-[#D49F2E] hover:bg-gray-100">
                        Your Profile
                      </Link>
                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="block w-full text-left px-4 py-2 text-sm text-[#D49F2E] cursor-pointer hover:bg-gray-100 disabled:opacity-50 relative"
                      >
                        {isLoggingOut ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 mr-2 border-2 border-t-[#D49F2E] border-r-transparent border-b-[#D49F2E] border-l-transparent rounded-full animate-spin"></div>
                            <span>Logging out...</span>
                          </div>
                        ) : (
                          "Logout"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-600 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-[#D49F2E] text-white font-medium rounded-lg hover:bg-[#D49F2E] transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
  return requireAuth ? (
    <ProtectedRoute redirectUnauthenticated={true}>{renderNavbarContent()}</ProtectedRoute>
  ) : (
    <ProtectedRoute redirectUnauthenticated={false}>{renderNavbarContent()}</ProtectedRoute>
  )
}
