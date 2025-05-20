import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export interface SubscriptionResponse {
  message: string
  success: boolean
}

export interface SubscriptionRequest {
  email: string
}

export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    subscribeEmail: builder.mutation<SubscriptionResponse, SubscriptionRequest>({
      query: (data) => ({
        url: "subscribe",
        method: "POST",
        body: data,
      }),
    }),
  }),
})

export const { useSubscribeEmailMutation } = subscriptionApi
