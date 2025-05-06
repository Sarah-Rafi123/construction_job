"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import ChatSidebar from "@/components/chat-components/chat-sidebar";
import ChatWindow from "@/components/chat-components/chat-window";
import UserDetails from "@/components/chat-components/user-details";
import ProtectedRoute from "@/components/global/ProtectedRoute";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setActiveConversation } from "@/store/slices/chatSlice";

export default function ChatPage() {
  const { conversationId } = useParams();
  const dispatch = useDispatch();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(true);
  const { inbox } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    const conversation = inbox?.find((c) => c._id === conversationId);
    if (conversation) {
      dispatch(setActiveConversation(conversation));
    }
    return () => {
      dispatch(setActiveConversation(null));
    };
  }, [conversationId, inbox, dispatch]);

  const toggleMobileDrawer = () => setIsMobileDrawerOpen(!isMobileDrawerOpen);
  const toggleDetailsPanel = () => setIsDetailsPanelOpen(!isDetailsPanelOpen);

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
