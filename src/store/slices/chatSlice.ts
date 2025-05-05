import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { Chat } from "../api/chatApi" 

interface ChatState {
  inbox: Chat[]
}

const initialState: ChatState = {
  inbox: [],
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setInbox: (state, action: PayloadAction<Chat[]>) => {
      state.inbox = action.payload
    },
  },
})

export const { setInbox } = chatSlice.actions
export default chatSlice.reducer
