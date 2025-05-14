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
    baseUrl: "http://localhost:9000",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getStatistics: builder.query<StatisticsResponse, void>({
      query: () => "api/v0/statistics",
    }),
  }),
})

export const { useGetStatisticsQuery } = statisticsApi
