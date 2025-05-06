"use client"

import Link from "next/link"
import { Briefcase, LogOut } from "lucide-react"
import { useLogoutMutation } from "@/store/api/authApi"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Header() {
  const router = useRouter()
  const [logout, { isLoading }] = useLogoutMutation()
  const [error, setError] = useState<string | null>(null)

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      // Redirect to login page after successful logout
      router.push("/login")
    } catch (err) {
      console.error("Failed to logout:", err)
      setError("Failed to logout. Please try again.")
    }
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Briefcase className="h-6 w-6 text-[#D49F2E] mr-2" />
            <span className="text-xl font-bold text-black">Jay Constructions</span>
          </div>
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
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              {isLoading ? (
                "Logging out..."
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </>
              )}
            </button>
            {error && <div className="text-red-500 text-sm">{error}</div>}
          </div>
        </div>
      </div>
    </header>
  )
}
