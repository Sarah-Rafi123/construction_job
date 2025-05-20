"use client"
import socket from "@/lib/socket/connectSocket"
import type React from "react"

import { useRef, useEffect, useState } from "react"
import { Avatar } from "@mui/material"
import { Menu, FileText, Download } from "lucide-react"
import { formatTime } from "../../../utils/formatTime"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { useGetMessagesByConversationIdQuery } from "@/store/api/chatApi"
import ChatInputForm from "./chat-input-form"
import { useDispatch } from "react-redux"
import { addMessage, updateConversationInInbox } from "@/store/slices/chatSlice"
import AttachmentViewer from "./attachment-viewer"

interface ChatWindowProps {
  toggleMobileDrawer: () => void
  toggleDetailsPanel: () => void
}

export default function ChatWindow({ toggleMobileDrawer, toggleDetailsPanel }: ChatWindowProps) {
  const dispatch = useDispatch()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { currentUser } = useSelector((state: RootState) => state.user)
  const { messages, activeConversation } = useSelector((state: RootState) => state.chat)
  const user = activeConversation?.participants.find((u) => u._id !== currentUser?.id)
  const { isLoading, isError } = useGetMessagesByConversationIdQuery(activeConversation?._id || "", {
    skip: !activeConversation,
  })

  // State for attachment viewer
  const [viewingAttachment, setViewingAttachment] = useState<string | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      dispatch(updateConversationInInbox(data.conversation))
      if (activeConversation?._id == data.conversation._id) {
        dispatch(addMessage(data.message))
      }
    })

    return () => {
      socket.off("receiveMessage")
    }
  }, [activeConversation, socket])

  // Helper function to get file name from URL
  const getFileNameFromUrl = (url: string) => {
    try {
      const urlParts = url.split("/")
      return urlParts[urlParts.length - 1]
    } catch (error) {
      return "attachment"
    }
  }

  // Handle attachment click
  const handleAttachmentClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault()
    setViewingAttachment(url)
  }

  if (!messages || !activeConversation) {
    return (
      <div className=" flex flex-col h-screen bg-white">
        <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-3">
            <button className="text-gray-500 hover:text-gray-700" onClick={toggleMobileDrawer}>
              <Menu size={24} />
            </button>
            <h2 className="text-md font-medium text-xl text-gray-800">Select a conversation</h2>
          </div>
        </div>

        <div className="flex items-center h-screen justify-center">
          <p className="text-gray-500 text-xl">Select a conversation to start chatting</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Attachment Viewer Modal */}
      {viewingAttachment && <AttachmentViewer url={viewingAttachment} onClose={() => setViewingAttachment(null)} />}

      <div className="flex items-center justify-between p-4 border border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <button className="lg:hidden text-gray-500 hover:text-gray-700 mr-1" onClick={toggleMobileDrawer}>
            <Menu size={24} />
          </button>
          <Avatar src={user?.profile_picture} sx={{ width: 40, height: 40 }} />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-medium text-gray-900">{user?.full_name ?? user?.company_name}</h2>
            </div>
          </div>
        </div>
        <div className="items-center gap-2 lg:flex">
          <button
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 lg"
            onClick={toggleDetailsPanel}
          >
            <span className="underline text-[#D49F2E] hover">View Profile </span>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages?.map((message, index) => {
          const isUser = message.sender === currentUser?.id
          return (
            <div key={index} className="mb-4">
              <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div className={`flex ${!isUser && "items-end"} gap-2 max-w-[80%]`}>
                  {!isUser && <div className="w-8" />}
                  <div>
                    {message.type === "text" ? (
                      <div className="bg-[#F2E2A0] text-gray-600 rounded-lg p-3 text-sm space-y-1">
                        <p>{message.content}</p>
                        <p className="text-xs text-right text-gray-500">{formatTime(message.updatedAt)}</p>
                      </div>
                    ) : (
                      <div className="bg-[#F2E2A0] text-gray-600 rounded-lg p-3 text-sm space-y-2">
                        {/* Enquiry Box with Title and Description */}
                        <div className="border-b border-[#D49F2E] pb-2 mb-2">
                          <p className="text-xs font-medium text-black mb-2">Title</p>
                          <h3 className="font-medium text-gray-800">{message.enquiry?.title}</h3>
                        </div>
                        <p className="text-xs font-medium text-black mb-2">Description</p>
                        <p className="text-black">{message.enquiry?.description}</p>

                        {/* Attachments Section */}
                        {message.enquiry?.attachments && message.enquiry.attachments.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-[#D49F2E]">
                            <p className="text-xs font-medium text-black mb-2">Attachment</p>
                            {message.enquiry.attachments.map((attachment: string, idx: number) => (
                              <div
                                key={idx}
                                onClick={(e) => handleAttachmentClick(e, attachment)}
                                className="flex items-center gap-2 p-2 bg-white rounded-md mb-1 hover:bg-gray-50 transition-colors cursor-pointer"
                              >
                                <FileText size={16} className="text-[#D49F2E]" />
                                <span className="text-xs text-gray-700 flex-1 truncate">
                                  {getFileNameFromUrl(attachment)}
                                </span>
                                <Download size={14} className="text-gray-500" />
                              </div>
                            ))}
                          </div>
                        )}

                        <p className="text-xs text-right text-gray-500 mt-1">{formatTime(message.updatedAt)}</p>
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
      <ChatInputForm />
    </div>
  )
}
