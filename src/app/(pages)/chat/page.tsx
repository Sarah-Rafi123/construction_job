"use client"

import { useState } from "react"
import ChatSidebar from "@/components/chat-components/chat-sidebar"
import ChatWindow from "@/components/chat-components/chat-window"
import UserDetails from "@/components/chat-components/user-details"
import ProtectedRoute from "@/components/global/ProtectedRoute"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

export default function ChatPage() {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(true)

  const toggleMobileDrawer = () => {
    setIsMobileDrawerOpen(!isMobileDrawerOpen)
  }

  const toggleDetailsPanel = () => {
    setIsDetailsPanelOpen(!isDetailsPanelOpen)
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex bg-white">
          <ChatSidebar isMobileDrawerOpen={isMobileDrawerOpen} toggleMobileDrawer={toggleMobileDrawer} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <ChatWindow toggleMobileDrawer={toggleMobileDrawer} toggleDetailsPanel={toggleDetailsPanel} />
          </div>
          <UserDetails isOpen={isDetailsPanelOpen} togglePanel={toggleDetailsPanel} />
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
