"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MessageSquare, User, ChevronDown } from "react-feather"
import { useLogoutMutation } from "@/store/api/authApi"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { Briefcase } from "lucide-react"
interface NavbarProps {
  messageCount?: number
}

export default function Navbar({ messageCount = 0 }: NavbarProps) {
  const router = useRouter()
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [quickReply, setQuickReply] = useState("")

  // Get authentication state and user info from Redux
  const isAuthenticated = useSelector((state: RootState) => state.user?.isAuthenticated)
  const currentUser = useSelector((state: RootState) => state.user?.currentUser)

  // Display user's name or company name if available, otherwise fallback to "Account"
  const displayName = currentUser?.full_name || currentUser?.company_name || "Account"

  const [messages, setMessages] = useState([
    {
      id: "1",
      user: {
        id: "user1",
        name: "John Doe",
        avatar: "/avatar1.png",
        status: "online",
        initials: "JD",
        color: "#2563eb",
      },
      lastMessage: "Hey, how's it going?",
      time: "10:30 AM",
      unread: true,
    },
    {
      id: "2",
      user: {
        id: "user2",
        name: "Jane Smith",
        avatar: "/avatar2.png",
        status: "away",
        initials: "JS",
        color: "#d97706",
      },
      lastMessage: "I'll get back to you later.",
      time: "Yesterday",
      unread: false,
    },
    {
      id: "3",
      user: {
        id: "user3",
        name: "Mike Johnson",
        avatar: null,
        status: "offline",
        initials: "MJ",
        color: "#16a34a",
      },
      lastMessage: "Did you see the game last night?",
      time: "2 days ago",
      unread: false,
    },
  ])

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

  const handleSendQuickReply = () => {
    if (quickReply.trim()) {
      // Simulate sending a quick reply
      alert(`Sending quick reply: ${quickReply}`)
      setQuickReply("")
    }
  }

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      // Close the menu
      setIsUserMenuOpen(false)
      // Redirect to landing page after successful logout
      router.push("/landing-page")
    } catch (error) {
      console.error("Logout failed:", error)
      // Even if the API call fails, still redirect to landing page
      router.push("/landing-page")
    }
  }

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 ">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Briefcase className="h-10 w-10 mr-2 text-[#D49F2E]" />
              <span className="text-xl ml-2 font-bold text-black">Jay Constructions</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Chat button - only shown when logged in */}
                <Link
                  href="/messages"
                  className="flex items-center px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MessageSquare size={20} className="mr-1" />
                  <span className="text-sm font-medium">Chat</span>
                  {messageCount > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {messageCount}
                    </span>
                  )}
                </Link>

                {/* User menu - only shown when logged in */}
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

                  {/* User menu dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Your Profile
                      </Link>
                      <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Settings
                      </Link>
                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                      >
                        {isLoggingOut ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Login and Signup buttons - only shown when not logged in */}
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
}
