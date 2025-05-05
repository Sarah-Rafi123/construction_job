import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "./api/authApi";
import { jobSeekerApi } from "./api/jobSeekerApi";
import { jobsApi } from "./api/jobsApi";
import { jobPostingApi } from "./api/jobPostingApi";
import { chatApi } from "./api/chatApi";
import { documentSubmissionApi } from "./api/documentSubmissionApi";
import userReducer from "./slices/userSlice";
import chatReducer from "./slices/chatSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
    [authApi.reducerPath]: authApi.reducer,
    [jobSeekerApi.reducerPath]: jobSeekerApi.reducer,
    [jobsApi.reducerPath]: jobsApi.reducer,
    [jobPostingApi.reducerPath]: jobPostingApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [documentSubmissionApi.reducerPath]: documentSubmissionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      jobSeekerApi.middleware,
      jobsApi.middleware,
      jobPostingApi.middleware,
      chatApi.middleware,
      documentSubmissionApi.middleware
    ),
});
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
