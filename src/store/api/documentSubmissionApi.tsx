import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// Define response type
export interface DocumentSubmissionResponse {
  success: boolean
  message: string
}

// Create the API slice for document submission
export const documentSubmissionApi = createApi({
  reducerPath: "documentSubmissionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    credentials: "include", 
  }),
  endpoints: (builder) => ({
    submitContractorDocuments: builder.mutation<
      DocumentSubmissionResponse,
      FormData // Using FormData to handle file uploads
    >({
      query: (formData) => ({
        url: "/submit-contractor-documents",
        method: "POST",
        body: formData,
        // Don't set Content-Type header - it will be set automatically with the correct boundary
        formData: true,
      }),
    }),
  }),
})

export const { useSubmitContractorDocumentsMutation } = documentSubmissionApi
