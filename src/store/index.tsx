import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { authApi } from "./api/authApi"
import { jobSeekerApi } from "./api/jobSeekerApi"
import { jobsApi } from "./api/jobsApi"
import { jobPostingApi } from "./api/jobPostingApi"
import { documentSubmissionApi } from "./api/documentSubmissionApi"
import userReducer from "./slices/userSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    [jobSeekerApi.reducerPath]: jobSeekerApi.reducer,
    [jobsApi.reducerPath]: jobsApi.reducer,
    [jobPostingApi.reducerPath]: jobPostingApi.reducer,
    [documentSubmissionApi.reducerPath]: documentSubmissionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      jobSeekerApi.middleware,
      jobsApi.middleware,
      jobPostingApi.middleware,
      documentSubmissionApi.middleware,
    ),
})
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
