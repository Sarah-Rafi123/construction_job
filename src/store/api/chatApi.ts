import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { setInbox } from "../slices/chatSlice"
export interface Participant {
    _id: string
    email: string
    role: string
    company_name: string
    full_name:string
  }
  
  export interface LastMessage {
    _id: string
    sender: Participant
    content: string
    type: string
    updatedAt: string
  }
  
  export interface Chat {
    _id: string
    participants: Participant[]
    lastMessage: LastMessage
    createdAt: string
    updatedAt: string
    __v: number
  }
  
  export interface InboxResponse {
    status: string
    results: number
    data: Chat[]
  }
  

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:9000/api/v0/",
    credentials: "include", // This is important to send cookies with requests
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
  
  }),
})

export const { useGetInboxQuery } = chatApi
