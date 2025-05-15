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
  redirectUnauthenticated?: boolean
}

const ProtectedRoute = ({ children, allowedRoles, redirectUnauthenticated = true }: ProtectedRouteProps) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const currentUser = useSelector((state: RootState) => state.user?.currentUser)

  // Track if component is mounted to prevent state updates after unmount
  const isMounted = useRef(true)

  // Track if we've already attempted to reconnect the socket
  const socketConnected = useRef(false)

  // Track if we've already authenticated for this session
  const hasAuthenticated = useRef(false)

  // Function to fetch user data
  const fetchUser = async () => {
    // If we've already authenticated or are not mounted, don't fetch again
    if (hasAuthenticated.current || !isMounted.current) {
      return
    }

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}get-me`, {
        withCredentials: true,
      })

      // Check if component is still mounted before updating state
      if (!isMounted.current) return

      const user = response.data.data
      dispatch(setCurrentUser(user))

      // Mark that we've authenticated
      hasAuthenticated.current = true

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

      // console.error("Not authenticated:", error)
      dispatch(clearCurrentUser())

      // Mark that we've attempted authentication
      hasAuthenticated.current = true

      // Only redirect if redirectUnauthenticated is true
      if (redirectUnauthenticated) {
        router.replace("/landing-page")
      } else {
        setLoading(false) // Still need to set loading to false if not redirecting
      }
    }
  }
  useEffect(() => {
    isMounted.current = true
    hasAuthenticated.current = false

    if (!currentUser) {
      fetchUser()
    } else {
      hasAuthenticated.current = true

      if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        router.replace("/")
      } else {
        setLoading(false)

        if (!socketConnected.current) {
          socket.connect()
          socketConnected.current = true
        }
      }
    }

    // Clean up function
    return () => {
      isMounted.current = false
    }
  }, []) // Empty dependency array means this only runs once on mount

  // Handle changes to currentUser or allowedRoles without re-fetching
  useEffect(() => {
    if (currentUser) {
      if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        router.replace("/")
      } else {
        setLoading(false)
      }
    }
  }, [currentUser, allowedRoles, router])

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
