"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push("/landing-page")
  }, [router])

  return (
    <div className="flex-1 overflow-hidden min-h-screen flex items-center justify-center">
     
    </div>
  )
}
