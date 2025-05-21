"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import ChatSidebar from "@/components/chat-components/chat-sidebar"
import ChatWindow from "@/components/chat-components/chat-window"
import UserDetails from "@/components/chat-components/user-details"
import ProtectedRoute from "@/components/global/ProtectedRoute"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

export default function ChatPage() {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false)
  const pathname = usePathname()

  // Close details panel when route changes (when selecting a different chat)
  useEffect(() => {
    setIsDetailsPanelOpen(false)
  }, [pathname])

  const toggleMobileDrawer = () => {
    setIsMobileDrawerOpen(!isMobileDrawerOpen)
  }

  const toggleDetailsPanel = () => {
    setIsDetailsPanelOpen(!isDetailsPanelOpen)
  }

  // Function to explicitly close the details panel
  const closeDetailsPanel = () => {
    setIsDetailsPanelOpen(false)
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
          <Navbar />
        </div>
        <div className="flex mt-16 bg-white">
          <ChatSidebar
            isMobileDrawerOpen={isMobileDrawerOpen}
            toggleMobileDrawer={toggleMobileDrawer}
            closeDetailsPanel={closeDetailsPanel}
          />
          <div className="flex-1 flex flex-col overflow-hidden">
            <ChatWindow toggleMobileDrawer={toggleMobileDrawer} toggleDetailsPanel={toggleDetailsPanel} />
          </div>
          {/* Pass isOpen prop to control visibility */}
          <UserDetails isOpen={isDetailsPanelOpen} togglePanel={toggleDetailsPanel} />
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
