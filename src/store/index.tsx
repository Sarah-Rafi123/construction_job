// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import userReducer from "./slices/userSlice";
export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
