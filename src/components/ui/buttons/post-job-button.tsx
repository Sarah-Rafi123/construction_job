"use client"

import { useRouter } from "next/navigation"
import Button from "@mui/material/Button"

interface PostJobButtonProps {
  userRole: "main_contractor" | "sub_contractor" | "employee" | "other"
}

export function PostJobButton({ userRole }: PostJobButtonProps) {
  const router = useRouter()

  // Only show button to main contractors or sub contractors
  if (userRole !== "main_contractor" && userRole !== "sub_contractor") {
    return null
  }

  return (
    <Button onClick={() => router.push("/post-job")} className="w-full md:w-auto">
      Let's Post a Job
    </Button>
  )
}
