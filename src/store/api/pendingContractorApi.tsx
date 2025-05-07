import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
// Define types for the API responses and requests
export interface PendingContractor {
  _id: string
  email: string
  role: string
  company_name: string
  company_number: string
  compliance_certificate: string | null
  verification_certificate: string | null
}

export interface PendingContractorsResponse {
  message: string
  data: {
    pending_contractors: PendingContractor[]
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }
}

export interface VerifyContractorRequest {
  id: string
  admin_status: "verified" | "rejected"
}

export interface VerifyContractorResponse {
  success: boolean
  message: string
}

// Create the API slice
export const contractorApi = createApi({
  reducerPath: "contractorApi",
  baseQuery:fetchBaseQuery({
    baseUrl: "http://localhost:9000/api/v0",
    credentials: "include", 
  }),
  tagTypes: ["PendingContractors"],
  endpoints: (builder) => ({
    // Get pending contractors
    getPendingContractors: builder.query<PendingContractorsResponse, void>({
      query: () => "/pending-contractors",
      providesTags: ["PendingContractors"],
    }),

    // Verify contractor documents
    verifyContractorDocuments: builder.mutation<VerifyContractorResponse, VerifyContractorRequest>({
      query: (data) => ({
        url: "/verify-contractor-documents",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PendingContractors"],
    }),
  }),
})

// Export the generated hooks
export const { useGetPendingContractorsQuery, useVerifyContractorDocumentsMutation } = contractorApi
