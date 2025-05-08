import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";

interface User {
  profile_picture: any;
  description: any;
  id: string;
  email: string;
  role: string;
  verifyEmail: boolean;
  full_name?: string;
  company_name?: string;
  company_number?: string;
  phone_number?: string;
  trade?: string;
  admin_status?: string;
}

// Comprehensive initial state combining both files
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
    // Combined setCurrentUser that handles both implementations
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      
      // Set userType based on role if available (from second file)
      if (action.payload?.role) {
        state.userType = action.payload.role.replace("_", "-");
      }
    },
    // Combined clearCurrentUser/clearUser that handles both implementations
    clearCurrentUser: (state) => {
      state.currentUser = null;
      state.email = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.userType = null;
    },
    // Alias for clearCurrentUser to maintain backward compatibility
    clearUser: (state) => {
      state.email = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.userType = null;
      state.currentUser = null;
    },
    setUserType: (state, action: PayloadAction<string>) => {
      state.userType = action.payload;
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
      state.currentUser = null;
    });
  },
});

export const { 
  setEmail, 
  setCredentials, 
  setUserType, 
  clearUser, 
  setCurrentUser, 
  clearCurrentUser 
} = userSlice.actions;

export default userSlice.reducer;