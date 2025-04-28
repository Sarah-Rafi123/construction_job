import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
  currentUser: null as User | null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    clearUser: (state) => {
      state.email = null;
    },
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
});

export const { setEmail, clearUser, setCurrentUser, clearCurrentUser } = userSlice.actions;

export default userSlice.reducer;
