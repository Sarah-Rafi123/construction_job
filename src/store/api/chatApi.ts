import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { setInbox,setMessages } from "../slices/chatSlice"
import { InboxResponse ,MessagesResponse} from "@/types/chatTypes"

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getInbox: builder.query<InboxResponse, void>({
      query: () => "inbox",
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setInbox(data.data)) // <-- sync to Redux state
        } catch (error) {
          console.error("Inbox fetch failed:", error)
        }
      },
   
    }),
    getMessagesByConversationId: builder.query<MessagesResponse, string>({
      query: (conversationId) => `chat?conversationId=${conversationId}`,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setMessages(data.data))
        } catch (error) {
          console.error("Message fetch failed:", error)
        }
      },
    }),
  
  }),
})

export const { useGetInboxQuery,useGetMessagesByConversationIdQuery } = chatApi
