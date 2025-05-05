"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Avatar, TextField, IconButton } from "@mui/material";
import { Menu, X, Paperclip, Send } from "lucide-react";
import type { Conversation, User, Message } from "@/lib/types";
import { formatTime } from "../../../utils/formatTime";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useGetMessagesByConversationIdQuery } from "@/store/api/chatApi";
interface ChatWindowProps {
  toggleMobileDrawer: () => void;
  toggleDetailsPanel: () => void;
}

export default function ChatWindow({ toggleMobileDrawer, toggleDetailsPanel }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { messages, activeConversation } = useSelector((state: RootState) => state.chat);
  const user = activeConversation?.participants.find((u) => u._id !== currentUser?.id);
  const { isLoading, isError } = useGetMessagesByConversationIdQuery(activeConversation?._id || "", {
    skip: !activeConversation,
  });

  console.log("messages are", messages);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !messages) return;
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  if (!messages || !activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <button className="lg:hidden text-gray-500 hover:text-gray-700 mr-1" onClick={toggleMobileDrawer}>
            <Menu size={24} />
          </button>
          <Avatar src={user?.profile_picture} sx={{ width: 40, height: 40 }} />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-medium text-gray-900">{user?.full_name ?? user?.company_name}</h2>
              {user?.isOnline && (
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  <span className="text-sm text-gray-500">Online</span>
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100" onClick={toggleDetailsPanel}>
            <X size={24} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {/* {conversation.dateRange && (
          <div className="flex justify-center mb-4">
            <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">{conversation.dateRange}</span>
          </div>
        )} */}
        {messages?.map((message, index) => {
          const isUser = message.sender._id === currentUser?.id;
          return (
            <div key={index} className="mb-4">
              <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div className={`flex ${!isUser && "items-end"} gap-2 max-w-[80%]`}>
                  {!isUser && <div className="w-8" />}
                  <div>
                    <div className="bg-gray-100 text-gray-600 rounded-lg p-3 text-sm space-y-1">
                      <p>{message.type === "text" ? message.content : message.enquiry.description}</p>
                      <p className="text-xs text-right text-gray-500">{formatTime(message.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <IconButton color="default" aria-label="attach file">
            <Paperclip size={20} />
          </IconButton>
          <TextField
            fullWidth
            placeholder="Reply..."
            variant="outlined"
            size="small"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "24px",
              },
            }}
          />
          <IconButton color="primary" aria-label="send message" type="submit" disabled={!newMessage.trim()}>
            <Send size={20} />
          </IconButton>
        </form>
      </div>
    </div>
  );
}
