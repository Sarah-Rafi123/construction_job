import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { Chat } from "../api/chatApi"

interface EnquiryMessage {
  _id: string
  conversation: string
  sender: {
    _id: string
    email: string
    role: string
  }
  type: "enquiry"
  status: string
  enquiry: {
    title: string
    description: string
    jobId: string
  }
  createdAt: string
  updatedAt: string
  __v: number
}

interface TextMessage {
  _id: string
  conversation: string
  sender: {
    _id: string
    email: string
    role: string
  }
  type: "text"
  status: string
  content: string
  createdAt: string
  updatedAt: string
  __v: number
}

export type Message = EnquiryMessage | TextMessage

interface ChatState {
  inbox: Chat[] | null
  activeConversation: Chat | null
  messages: Message[] | null
}

const initialState: ChatState = {
  inbox: null,
  activeConversation: null,
  messages: null,
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setInbox: (state, action: PayloadAction<Chat[]>) => {
      state.inbox = action.payload
    },
    setActiveConversation: (state, action: PayloadAction<Chat | null>) => {
      state.activeConversation = action.payload
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload
    },
  },
})

export const { setInbox, setActiveConversation, setMessages } = chatSlice.actions
export default chatSlice.reducer
