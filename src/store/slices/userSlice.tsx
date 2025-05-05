import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";

interface User {
  id: string;
  email: string;
  role: string;
  verifyEmail: boolean;
  full_name?: string;
  company_name?: string;
  company_number?: string;
  phone_number?: string;
  trade?: string;
  admin_status?: "string";
}

const initialState = {
  email: null as string | null,
  token: null as string | null,
  role: null as string | null,
  isAuthenticated: false as boolean | null,
  userType: null as string | null,
  currentUser: null as User | null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setCredentials: (state, action: PayloadAction<{ email: string; token: string; role: string }>) => {
      const { email, token, role } = action.payload;
      state.email = email;
      state.token = token;
      state.role = role;
      state.isAuthenticated = true;
    },
    setUserType: (state, action: PayloadAction<string>) => {
      state.userType = action.payload;
    },
    clearUser: (state) => {
      state.email = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.userType = null;
    },
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    // When login is successful, update the user state
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
      state.email = payload.user.email;
      state.token = payload.token;
      state.role = payload.user.role;
      state.isAuthenticated = true;
    });

    // When logout is successful, clear the user state
    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
      state.email = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.userType = null;
    });
  },
});

export const { setEmail, setCredentials, setUserType, clearUser, setCurrentUser, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;
