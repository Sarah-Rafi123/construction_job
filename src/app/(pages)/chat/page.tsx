"use client";

import { useState } from "react";
import ChatSidebar from "@/components/chat-components/chat-sidebar";
import ChatWindow from "@/components/chat-components/chat-window";
import UserDetails from "@/components/chat-components/user-details";
import ProtectedRoute from "@/components/global/ProtectedRoute";

export default function ChatPage() {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(true);

  const toggleMobileDrawer = () => {
    setIsMobileDrawerOpen(!isMobileDrawerOpen);
  };

  const toggleDetailsPanel = () => {
    setIsDetailsPanelOpen(!isDetailsPanelOpen);
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <ChatSidebar isMobileDrawerOpen={isMobileDrawerOpen} toggleMobileDrawer={toggleMobileDrawer} />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <ChatWindow toggleMobileDrawer={toggleMobileDrawer} toggleDetailsPanel={toggleDetailsPanel} />
        </div>

        <UserDetails isOpen={isDetailsPanelOpen} togglePanel={toggleDetailsPanel} />
      </div>
    </ProtectedRoute>
  );
}
