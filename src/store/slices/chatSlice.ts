import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ChatState,Chat,Message } from "@/types/chatTypes"

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
    addMessage: (state, action: PayloadAction<Message>) => {
      state?.messages?.push(action.payload);
    },
    updateConversationInInbox: (state, action: PayloadAction<Chat>) => {
      if (!state.inbox) return;
      const index = state.inbox.findIndex(convo => convo._id === action.payload._id);
      if (index !== -1) {
        state.inbox[index] = action.payload;
      }
    },
  },
})

export const { setInbox, setActiveConversation, setMessages,addMessage,updateConversationInInbox } = chatSlice.actions
export default chatSlice.reducer
