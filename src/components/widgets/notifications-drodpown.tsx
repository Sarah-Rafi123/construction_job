"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface NotificationItem {
  id: string
  user: {
    name: string
    avatar?: string
    initials?: string
    color?: string
  }
  action: string
  target: string
  targetUrl?: string
  time: string
  read: boolean
  file?: {
    name: string
    size: string
  }
  mention?: {
    text: string
    user: string
  }
}

export default function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
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
    {
      id: "3",
      user: {
        name: "Jacob Jones",
        avatar: "/placeholder.svg?height=48&width=48",
      },
      action: "Mentioned you in the",
      target: "Rewrite text-button components in React for dark and light mode",
      targetUrl: "#",
      time: "1:52pm",
      read: false,
      mention: {
        user: "@patryk",
        text: "Please make sure that you're...",
      },
    },
    {
      id: "4",
      user: {
        name: "Ralph Edwards",
        avatar: "/placeholder.svg?height=48&width=48",
        color: "#F9CDCD",
      },
      action: "Completed",
      target: "Create new components",
      targetUrl: "#",
      time: "1:34pm",
      read: false,
    },
    {
      id: "5",
      user: {
        name: "Annette Black",
        initials: "AB",
        color: "#E67E22",
      },
      action: "Completed",
      target: "Improve workflow in React",
      targetUrl: "#",
      time: "1:12pm",
      read: false,
    },
  ])

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    )
  }

  return (
    <div className="absolute right-0 mt-2 w-[400px] bg-white rounded-md shadow-lg border border-gray-200 z-50">
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" onClick={markAllAsRead}>
          Mark all as read
        </button>
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        {notifications.map((notification) => (
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

                {/* Mention */}
                {notification.mention && (
                  <div className="mt-2 bg-gray-100 rounded-md p-3">
                    <span className="text-blue-600 font-medium">{notification.mention.user}</span>{" "}
                    <span className="text-gray-700">{notification.mention.text}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
