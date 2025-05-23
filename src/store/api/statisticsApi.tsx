import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export interface StatisticsResponse {
  message: string
  stats: {
    totalJobs: number
    newlyPostedJobs: number
    totalCompanies: number
    totalCandidates: number
  }
}

export const statisticsApi = createApi({
  reducerPath: "statisticsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getStatistics: builder.query<StatisticsResponse, void>({
      query: () => "statistics",
    }),
  }),
})

export const { useGetStatisticsQuery } = statisticsApi