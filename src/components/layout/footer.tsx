"use client"

import type React from "react"

import { useState } from "react"
import { Briefcase, Facebook, Linkedin, Instagram, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useSubscribeEmailMutation } from "@/store/api/subscriptionApi"
import SitepalLogo from "@/assets/images/SitepalLogo.jpg";
import Image from "next/image";
export default function Footer() {
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState<string | null>(null)
  const [subscribeEmail, { isLoading }] = useSubscribeEmailMutation()
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const socialLoginUrls = {
    facebook: "https://www.facebook.com/login",
    linkedin: "https://www.linkedin.com/company/sitepal/e",
    instagram: "https://www.instagram.com/sitepal.ltd/#",
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset states
    setEmailError(null)
    setSubscriptionStatus(null)

    // Validate email
    if (!email.trim()) {
      setEmailError("Email is required")
      return
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address")
      return
    }

    try {
      const response = await subscribeEmail({ email }).unwrap()
      setSubscriptionStatus({
        success: true,
        message: "Email subscribed successfully",
      })
      setEmail("") // Clear the input after successful subscription

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSubscriptionStatus(null)
      }, 5000)
    } catch (error) {
      console.error("Subscription error:", error)
      setSubscriptionStatus({
        success: false,
        message: "Failed to subscribe. Please try again.",
      })
    }
  }

  return (
    <footer className="py-12 bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
            <Link href="/" className="flex-shrink-0 cursor-pointer flex items-center">
              <Image
                src={SitepalLogo || "/placeholder.svg"}
                alt="Company Logo"
                className="ml-2 sm:block hidden h-16"
                width={150}
                height={200}
                priority
              />
            </Link>
            </div>
            <p className="text-gray-400 mb-4">
              The ultimate platform connecting contractors, sub-contractors, and skilled workers for successful
              construction projects.
            </p>
            <div className="flex space-x-4">
              <a
                href={socialLoginUrls.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={socialLoginUrls.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={socialLoginUrls.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">About</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms-and-conditions" className="text-gray-400 hover:text-white transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <a href="/contact-us" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Get job notifications</h4>
            <p className="text-gray-400 mb-4">The latest job news, articles, sent to your inbox weekly.</p>
            <form className="w-auto" onSubmit={handleSubscribe}>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (emailError) setEmailError(null)
                  }}
                  className={`px-4 py-2 bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-2 min-w-2 focus:ring-[#F5A623] border ${
                    emailError ? "border-red-500" : "border-gray-700"
                  } flex-grow`}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 ${
                    isLoading ? "bg-gray-600" : "bg-[#F5A623] hover:bg-[#E09613]"
                  } text-white font-medium rounded-r-lg cursor-pointer transition-colors`}
                >
                  {isLoading ? "Subscribing..." : "Subscribe"}
                </button>
              </div>

              {emailError && (
                <div className="mt-2 text-red-400 text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {emailError}
                </div>
              )}

              {subscriptionStatus && (
                <div
                  className={`mt-2 ${
                    subscriptionStatus.success ? "text-green-400" : "text-red-400"
                  } text-sm flex items-center`}
                >
                  {subscriptionStatus.success ? (
                    <CheckCircle className="h-4 w-4 mr-1" />
                  ) : (
                    <AlertCircle className="h-4 w-4 mr-1" />
                  )}
                  {subscriptionStatus.message}
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} Site-Pal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
