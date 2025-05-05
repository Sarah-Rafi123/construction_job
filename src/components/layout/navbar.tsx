"use client";

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Bell, MessageSquare, ChevronDown, Briefcase, Download, Send, User, LogOut } from "lucide-react"
import Avatar from "@mui/material/Avatar"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useLogoutMutation } from "@/store/api/authApi"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { clearUser } from "@/store/slices/userSlice"

interface NavbarProps {
  notificationCount?: number
  messageCount?: number
}

export default function Navbar({ notificationCount = 0, messageCount = 0 }: NavbarProps) {
  const router = useRouter()
  const [logoutMutation] = useLogoutMutation()

  // Get user data from Redux store
  const { email, isAuthenticated, userType } = useAppSelector((state) => state.user)
  const userName = useAppSelector((state) => state.user?.email?.split("@")[0] || "User")

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
  }

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isMessagesOpen, setIsMessagesOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const messagesRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const [quickReply, setQuickReply] = useState("")
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const dispatch = useAppDispatch()

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (messagesRef.current && !messagesRef.current.contains(event.target as Node)) {
        setIsMessagesOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    try {
      // Call the logout endpoint to clear the cookie on the server
      await logoutMutation().unwrap()

      // Clear the user state in Redux
      dispatch(clearUser())

      // Clear local storage
      localStorage.removeItem("userType")

      // Redirect to login page
      router.push("/login")
    } catch (error) {
      console.error("Logout failed", error)
      // Even if the API call fails, clear Redux state and local storage
      dispatch(clearUser())
      localStorage.removeItem("userType")
      router.push("/login")
    }
  }

  // Sample notifications data
  const notifications = [
    {
      id: "1",
      user: {
        name: "Ralph Edwards",
        avatar: "/placeholder.svg?height=48&width=48",
        color: "#F9CDCD",
      },
      action: "Completed",
      target: "Improve workflow in Figma",
      targetUrl: "#",
      time: "5 min ago",
      read: false,
    },
    {
      id: "2",
      user: {
        name: "Robert Fox",
        avatar: "/placeholder.svg?height=48&width=48",
      },
      action: "Added file to",
      target: "Create dark mode for our iOS app",
      targetUrl: "#",
      time: "1 hour ago",
      read: false,
      file: {
        name: "dark-theme.zip",
        size: "1.2 MB",
      },
    },
    // Additional notifications removed for brevity
  ]

  // Sample messages data
  const messages = [
    {
      id: "1",
      user: {
        id: "user1",
        name: "Sarah Wilson",
        avatar: "/placeholder.svg?height=48&width=48",
        status: "online",
      },
      lastMessage: "Hey, I wanted to discuss the project timeline. Are you available for a quick call?",
      time: "2 min ago",
      unread: true,
    },
    {
      id: "2",
      user: {
        id: "user2",
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=48&width=48",
        status: "offline",
      },
      lastMessage: "I've sent you the updated design files. Let me know what you think!",
      time: "1 hour ago",
      unread: true,
    },
    // Additional messages removed for brevity
  ]

  const handleSendQuickReply = () => {
    if (quickReply.trim() && activeChat) {
      console.log(`Sending message to ${activeChat}: ${quickReply}`);
      setQuickReply("");
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-7xl">
        <Link href="/" className="flex items-center">
          <span className="text-[#D49F2E] mr-2">
            <Briefcase size={24} />
          </span>
          <span className="text-lg font-semibold text-gray-800">Jay</span>
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            {/* Notification bell with dropdown */}
            <div className="relative" ref={notificationsRef}>
              <button
                className="focus:outline-none"
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen)
                  setIsMessagesOpen(false)
                  setIsUserMenuOpen(false)
                }}
                aria-label="Notifications"
              >
                <Bell size={20} className="text-gray-600" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>

            {/* Notifications dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-[400px] bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Mark all as read</button>
                </div>

                  <div className="max-h-[500px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div key={notification.id} className="border-b border-gray-100 px-4 py-3">
                          <div className="flex items-start gap-3">
                            {/* Unread indicator */}
                            {!notification.read && (
                              <div className="mt-2">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              </div>
                            )}

                            {/* Avatar */}
                            <div className="flex-shrink-0">
                              {notification.user.avatar ? (
                                <div
                                  className="w-12 h-12 rounded-full overflow-hidden"
                                  style={{ backgroundColor: notification.user.color || "#f3f4f6" }}
                                >
                                  <Image
                                    src={notification.user.avatar || "/placeholder.svg"}
                                    alt={notification.user.name}
                                    width={48}
                                    height={48}
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div
                                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium"
                                  style={{ backgroundColor: notification.user.color || "#6B7280" }}
                                >
                                  {notification.user.initials}
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <p className="font-medium text-gray-900">{notification.user.name}</p>
                                <span className="text-gray-500 text-sm">{notification.time}</span>
                              </div>

                              <p className="text-gray-700">
                                {notification.action}{" "}
                                <Link href={notification.targetUrl || "#"} className="text-blue-600 hover:underline">
                                  {notification.target}
                                </Link>
                              </p>

                              {/* File attachment */}
                              {notification.file && (
                                <div className="mt-2 bg-gray-100 rounded-md p-3 flex items-center gap-3">
                                  <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center">
                                    <Download size={20} className="text-gray-700" />
                                  </div>
                                  <div>
                                    <p className="text-gray-900">{notification.file.name}</p>
                                    <p className="text-gray-500 text-sm">{notification.file.size}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-gray-500">No notifications to display</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Messages with dropdown */}
            <div className="relative" ref={messagesRef}>
              <button
                className="focus:outline-none"
                onClick={() => {
                  setIsMessagesOpen(!isMessagesOpen)
                  setIsNotificationsOpen(false)
                  setIsUserMenuOpen(false)
                }}
                aria-label="Messages"
              >
                <MessageSquare size={20} className="text-gray-600" />
                {messageCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {messageCount}
                  </span>
                )}
              </button>

            {/* Messages dropdown */}
            {isMessagesOpen && (
              <div className="absolute right-0 mt-2 w-[400px] bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
                  <Link href="/messages" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View all
                  </Link>
                </div>

                  <div className="max-h-[500px] overflow-y-auto">
                    {messages.length > 0 ? (
                      messages.map((message) => (
                        <div key={message.id}>
                          <button
                            className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                              activeChat === message.user.id ? "bg-gray-50" : ""
                            }`}
                            onClick={() => setActiveChat(activeChat === message.user.id ? null : message.user.id)}
                          >
                            <div className="flex items-start gap-3">
                              {/* Unread indicator */}
                              {message.unread && (
                                <div className="mt-2">
                                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                </div>
                              )}

                              {/* Avatar with status */}
                              <div className="flex-shrink-0 relative">
                                {message.user.avatar ? (
                                  <div className="w-12 h-12 rounded-full overflow-hidden">
                                    <Image
                                      src={message.user.avatar || "/placeholder.svg"}
                                      alt={message.user.name}
                                      width={48}
                                      height={48}
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium"
                                    style={{ backgroundColor: message.user.color || "#6B7280" }}
                                  >
                                    {message.user.initials}
                                  </div>
                                )}
                                {/* Status indicator */}
                                <div
                                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                    message.user.status === "online"
                                      ? "bg-green-500"
                                      : message.user.status === "away"
                                        ? "bg-yellow-500"
                                        : "bg-gray-400"
                                  }`}
                                ></div>
                              </div>

                              {/* Content */}
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <p className="font-medium text-gray-900">{message.user.name}</p>
                                  <span className="text-gray-500 text-sm">{message.time}</span>
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-2">{message.lastMessage}</p>
                              </div>
                            </div>
                          </button>

                          {/* Quick reply area */}
                          {activeChat === message.user.id && (
                            <div className="px-4 py-3 bg-gray-50">
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={quickReply}
                                  onChange={(e) => setQuickReply(e.target.value)}
                                  placeholder="Type a quick reply..."
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      handleSendQuickReply()
                                    }
                                  }}
                                />
                                <button
                                  onClick={handleSendQuickReply}
                                  disabled={!quickReply.trim()}
                                  className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Send size={16} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-gray-500">No messages to display</div>
                    )}
                  </div>

                <div className="p-3 border-t border-gray-100 text-center">
                  <Link href="/messages" className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center">
                    Open Messages
                  </Link>
                </div>
              </div>
            )}
          </div>

            {/* User profile with dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                className="flex items-center focus:outline-none"
                onClick={() => {
                  setIsUserMenuOpen(!isUserMenuOpen)
                  setIsNotificationsOpen(false)
                  setIsMessagesOpen(false)
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "#D49F2E",
                    fontSize: "0.875rem",
                    fontWeight: "medium",
                  }}
                >
                  {getInitials(userName)}
                </Avatar>
                <span className="ml-2 text-gray-800">{userName}</span>
                <ChevronDown size={16} className="ml-1 text-gray-500" />
              </button>

              {/* User dropdown menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User size={16} className="mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 text-[#D49F2E] font-medium border border-[#D2D2D0] rounded-lg hover:bg-gray-50 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-[#D49F2E] text-white font-medium rounded-lg hover:bg-[#C48E1D] transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
