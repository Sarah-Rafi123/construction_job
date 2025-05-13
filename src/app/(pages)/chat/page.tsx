"use client";

import { useState } from "react";
import ChatSidebar from "@/components/chat-components/chat-sidebar";
import ChatWindow from "@/components/chat-components/chat-window";
import UserDetails from "@/components/chat-components/user-details";
import ProtectedRoute from "@/components/global/ProtectedRoute";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function ChatPage() {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(true);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(true);

  const toggleMobileDrawer = () => {
    setIsMobileDrawerOpen(!isMobileDrawerOpen);
  };

  const toggleDetailsPanel = () => {
    setIsDetailsPanelOpen(!isDetailsPanelOpen);
  };
  return (
    <ProtectedRoute>
     <div className="fixed top-0 left-0 right-0 z-50 bg-white">
            <Navbar />
          </div>
      <div className="flex min-h-full pt-4 bg-white">
        <ChatSidebar isMobileDrawerOpen={isMobileDrawerOpen} toggleMobileDrawer={toggleMobileDrawer} />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <ChatWindow toggleMobileDrawer={toggleMobileDrawer} toggleDetailsPanel={toggleDetailsPanel} />
        </div>

        <UserDetails isOpen={isDetailsPanelOpen} togglePanel={toggleDetailsPanel} />
      </div>
      <Footer/>
    </ProtectedRoute>
  );
}
