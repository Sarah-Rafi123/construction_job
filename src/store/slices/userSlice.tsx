import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

// Define the user state interface
interface UserState {
  isAuthenticated: boolean
  currentUser: any | null
  userType: string | null
}

// Initial state
const initialState: UserState = {
  isAuthenticated: false,
  currentUser: null,
  userType: null,
}

// Create the user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<any>) => {
      state.currentUser = action.payload
      state.isAuthenticated = true

      // Set userType based on role if available
      if (action.payload?.role) {
        state.userType = action.payload.role.replace("_", "-")
      }
    },
    clearCurrentUser: (state) => {
      state.currentUser = null
      state.isAuthenticated = false
      state.userType = null
    },
    setUserType: (state, action: PayloadAction<string>) => {
      state.userType = action.payload
    },
  },
})

// Export actions and reducer
export const { setCurrentUser, clearCurrentUser, setUserType } = userSlice.actions
export default userSlice.reducer
