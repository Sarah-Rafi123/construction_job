"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Avatar, TextField, IconButton } from "@mui/material"
import { Menu, X, Paperclip, Send } from "lucide-react"
import type { Conversation, User, Message } from "@/lib/types"
import { formatTime } from "@/lib/utils"

interface ChatWindowProps {
  conversation: Conversation | null
  user: User | null
  toggleMobileDrawer: () => void
  toggleDetailsPanel: () => void
}

export default function ChatWindow({ conversation, user, toggleMobileDrawer, toggleDetailsPanel }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [conversation?.messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !conversation) return
    console.log("Sending message:", newMessage)
    setNewMessage("")
  }

  if (!conversation || !user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a conversation to start chatting</p>
      </div>
    )
  }

  const renderMessageContent = (message: Message) => {
    if (message.images && message.images.length > 0) {
      return (
        <div className="mt-2">
          <p className="mb-2">{message.text}</p>
          <div className="flex flex-wrap gap-2">
            {message.images.map((image, index) => (
              <img
                key={index}
                src={image || "/placeholder.svg"}
                alt="Message attachment"
                className="rounded-lg w-24 h-24 object-cover"
              />
            ))}
          </div>
        </div>
      )
    }

    return <p>{message.text}</p>
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <button className="lg:hidden text-gray-500 hover:text-gray-700 mr-1" onClick={toggleMobileDrawer}>
            <Menu size={24} />
          </button>
          <Avatar src={user.avatar} alt={user.name} sx={{ width: 40, height: 40 }} />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-medium text-gray-900">{user.name}</h2>
              {user.isOnline && (
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  <span className="text-sm text-gray-500">Online</span>
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">  
          <button
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            onClick={toggleDetailsPanel}
          >
            <X size={24} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {conversation.dateRange && (
          <div className="flex justify-center mb-4">
            <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
              {conversation.dateRange}
            </span>
          </div>
        )}
        {conversation.messages.map((message, index) => {
          const isUser = message.senderId === "user"
          const showAvatar = !isUser && (index === 0 || conversation.messages[index - 1].senderId !== message.senderId)
          return (
            <div key={index} className="mb-4">
              {message.date && (
                <div className="flex justify-center my-4">
                  <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                    {message.date}
                  </span>
                </div>
              )}
              <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div className={`flex ${!isUser && "items-end"} gap-2 max-w-[80%]`}>
                  {!isUser && showAvatar ? (
                    <Avatar src={user.avatar} alt={user.name} sx={{ width: 32, height: 32 }} />
                  ) : (
                    !isUser && <div className="w-8" /> 
                  )}
                  <div>
                    {message.systemMessage ? (
                      <div className="bg-gray-100 text-gray-600 rounded-lg p-3 text-sm">{message.text}</div>
                    ) : (
                      <div
                        className={`
                        rounded-lg p-3 
                        ${isUser ? "bg-[#D49F2E] text-white" : "bg-white text-gray-800 shadow-sm"}
                      `}
                      >
                        {renderMessageContent(message)}

                        <div className={`text-xs mt-1 ${isUser ? "text-amber-100" : "text-gray-500"}`}>
                          {formatTime(message.time)}
                          {message.reaction && <span className="ml-2">{message.reaction}</span>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
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
  )
}
