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
  requireAuth?: boolean // New prop to control whether authentication is required
}

export default function Navbar({ messageCount = 0, requireAuth = false }: NavbarProps) {
  const router = useRouter()
  const dispatch = useDispatch()
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Get authentication state and user info from Redux
  const isAuthenticated = useSelector((state: RootState) => state.user?.isAuthenticated)
  const currentUser = useSelector((state: RootState) => state.user?.currentUser)

  // Use Redux data directly instead of fetching again
  const user = currentUser
  const isLoading = false // We don't need this anymore since we're using Redux

  // Display user's name or company name if available, otherwise fallback to "Account"
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

      // Close the menu
      setIsUserMenuOpen(false)

      // Clear Redux state
      dispatch(clearCurrentUser())

      // Clear any local storage items related to authentication
      localStorage.removeItem("userType")

      // Redirect to landing page after successful logout
      router.push("/landing-page")
    } catch (error) {
      console.error("Logout failed:", error)

      // Even if the API call fails, still clear state and redirect
      dispatch(clearCurrentUser())
      localStorage.removeItem("userType")
      router.push("/landing-page")
    }
  }

  // Determine if user is authenticated based on Redux state
  const isUserAuthenticated = isAuthenticated

  // Render the navbar content
  const renderNavbarContent = () => (
    <nav className="bg-white">
      <div className="max-w-7xl mx-auto px-4 ">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Briefcase className="h-10 w-10 mr-2 text-[#D49F2E]" />
              <span className="text-xl ml-2 font-bold text-black">Jay Constructions</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-t-[#D49F2E] border-r-transparent border-b-[#D49F2E] border-l-transparent rounded-full animate-spin"></div>
            ) : isUserAuthenticated ? (
              <>
                <Link
                  href="/chat"
                  className="flex items-center px-3 py-1.5 text-[#D49F2E] hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MessageSquare size={20} className="mr-1" />
                  <span className="text-sm font-medium">Chat</span>
                  {/* {messageCount > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {messageCount}
                    </span>
                  )} */}
                </Link>
                <div className="relative" ref={userMenuRef}>
                  <button
                    className="flex items-center text-gray-600 hover:text-gray-800 focus:outline-none"
                    onClick={() => {
                      setIsUserMenuOpen(!isUserMenuOpen)
                    }}
                    aria-label="User menu"
                  >
                    <User size={20} className="mr-1" />
                    <span className="text-sm font-medium">{displayName}</span>
                    <ChevronDown size={16} className="ml-1" />
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-6 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Your Profile
                      </Link>
                      {/* <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Settings
                      </Link> */}
                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 relative"
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

  // If authentication is required, wrap in ProtectedRoute, otherwise render directly
  return requireAuth ? (
    <ProtectedRoute redirectUnauthenticated={true}>{renderNavbarContent()}</ProtectedRoute>
  ) : (
    // For public pages, don't redirect on authentication failure
    <ProtectedRoute redirectUnauthenticated={false}>{renderNavbarContent()}</ProtectedRoute>
  )
}
