"use client"

import type React from "react"

import socket from "@/lib/socket/connectSocket"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { setCurrentUser, clearCurrentUser } from "@/store/slices/userSlice"
import type { RootState } from "@/store"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
  redirectUnauthenticated?: boolean // New prop to control redirection
}

const ProtectedRoute = ({
  children,
  allowedRoles,
  redirectUnauthenticated = true, // Default to true for backward compatibility
}: ProtectedRouteProps) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const currentUser = useSelector((state: RootState) => state.user?.currentUser || "")

  // Track if component is mounted to prevent state updates after unmount
  const isMounted = useRef(true)

  // Track if we've already attempted to reconnect the socket
  const socketConnected = useRef(false)

  // Function to fetch user data
  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/v0/get-me", {
        withCredentials: true,
      })

      // Check if component is still mounted before updating state
      if (!isMounted.current) return

      const user = response.data.data
      dispatch(setCurrentUser(user))

      if (allowedRoles && !allowedRoles.includes(user.role)) {
        router.replace("/")
        return
      }

      // Connect socket if not already connected
      if (!socketConnected.current) {
        socket.connect()
        socketConnected.current = true
      }

      setLoading(false)
    } catch (error) {
      // Check if component is still mounted before updating state
      if (!isMounted.current) return

      console.error("Not authenticated:", error)
      dispatch(clearCurrentUser())

      // Only redirect if redirectUnauthenticated is true
      if (redirectUnauthenticated) {
        router.replace("/landing-page")
      } else {
        setLoading(false) // Still need to set loading to false if not redirecting
      }
    }
  }

  // Handle initial authentication and role check
  useEffect(() => {
    // Set mounted flag
    isMounted.current = true

    if (!currentUser) {
      fetchUser()
    } else {
      if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        router.replace("/")
      } else {
        setLoading(false)

        // Connect socket if not already connected
        if (!socketConnected.current) {
          socket.connect()
          socketConnected.current = true
        }
      }
    }

    // Clean up function
    return () => {
      isMounted.current = false

      // Don't disconnect socket on unmount as it might be a page navigation
      // If you want to disconnect on logout, handle that separately
    }
  }, [allowedRoles, currentUser, router, dispatch, redirectUnauthenticated])

  // Handle page refresh
  useEffect(() => {
    // Listen for beforeunload event (page refresh)
    const handleBeforeUnload = () => {
      // You can optionally do something before the page refreshes
      // For example, save some state to localStorage
      localStorage.setItem("lastPath", window.location.pathname)
    }

    // Listen for visibilitychange event (tab becomes visible again)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Re-verify authentication when tab becomes visible again
        fetchUser()
      }
    }

    // Add event listeners
    window.addEventListener("beforeunload", handleBeforeUnload)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Clean up event listeners
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  // Handle back/forward navigation
  useEffect(() => {
    // Listen for popstate event (browser back/forward buttons)
    const handlePopState = () => {
      // Re-verify authentication on navigation
      fetchUser()
    }

    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [])

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
