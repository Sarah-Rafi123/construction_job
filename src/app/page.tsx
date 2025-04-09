"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the signup page when the main page loads
    router.push("/signup")
  }, [router])

  return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <div className="text-white text-center">
        <p>Redirecting to signup page...</p>
      </div>
    </div>
  )
}
