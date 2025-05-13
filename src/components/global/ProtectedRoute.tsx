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
  const isMounted = useRef(true)
  const socketConnected = useRef(false)
  const hasAuthenticated = useRef(false)
  const fetchUser = async () => {
    if (hasAuthenticated.current || !isMounted.current) {
      return
    }
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}get-me`, {
        withCredentials: true,
      })
      if (!isMounted.current) return
      const user = response.data.data
      dispatch(setCurrentUser(user))
      hasAuthenticated.current = true
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        router.replace("/")
        return
      }
      if (!socketConnected.current) {
        socket.connect()
        socketConnected.current = true
      }
      setLoading(false)
    } catch (error) {
      if (!isMounted.current) return
      console.error("Not authenticated:", error)
      dispatch(clearCurrentUser())
      hasAuthenticated.current = true
      if (redirectUnauthenticated) {
        router.replace("/landing-page")
      } else {
        setLoading(false) 
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
    return () => {
      isMounted.current = false
    }
  }, [])
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
