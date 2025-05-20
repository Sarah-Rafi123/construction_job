import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { authApi } from "./api/authApi"
import { jobSeekerApi } from "./api/jobSeekerApi"
import { jobsApi } from "./api/jobsApi"
import { jobPostingApi } from "./api/jobPostingApi"
import { chatApi } from "./api/chatApi"
import { documentSubmissionApi } from "./api/documentSubmissionApi"
import { userProfileApi } from "./api/userProfileApi"
import userReducer from "./slices/userSlice"
import chatReducer from "./slices/chatSlice"
import { adminStatusApi } from "./api/adminStatusApi"
import { contractorApi } from "./api/pendingContractorApi"
import { passwordResetApi } from "./api/passwordResetApi"
import { userPostedJobsApi } from "./api/userPostedJobsApi"
import { statisticsApi } from "./api/statisticsApi"
import { sampleJobsApi } from "./api/sampleJobsApi"
import { subscriptionApi } from "./api/subscriptionApi"
export const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
    [authApi.reducerPath]: authApi.reducer,
    [jobSeekerApi.reducerPath]: jobSeekerApi.reducer,
    [jobsApi.reducerPath]: jobsApi.reducer,
    [jobPostingApi.reducerPath]: jobPostingApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [statisticsApi.reducerPath]: statisticsApi.reducer,
    [documentSubmissionApi.reducerPath]: documentSubmissionApi.reducer,
    [userProfileApi.reducerPath]: userProfileApi.reducer,
    [contractorApi.reducerPath]: contractorApi.reducer,
    [adminStatusApi.reducerPath]: adminStatusApi.reducer,
    [passwordResetApi.reducerPath]: passwordResetApi.reducer,
    [userPostedJobsApi.reducerPath]: userPostedJobsApi.reducer,
    [sampleJobsApi.reducerPath]: sampleJobsApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      jobSeekerApi.middleware,
      jobsApi.middleware,
      jobPostingApi.middleware,
      chatApi.middleware,
      documentSubmissionApi.middleware,
      userProfileApi.middleware,
      contractorApi.middleware,
      passwordResetApi.middleware,
      userPostedJobsApi.middleware,
      statisticsApi.middleware,
      sampleJobsApi.middleware,
      subscriptionApi.middleware,
    ),
})
setupListeners(store.dispatch)
 
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
