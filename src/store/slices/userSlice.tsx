import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { authApi } from "../api/authApi"

interface UserState {
  email: string | null
  token: string | null
  role: string | null
  isAuthenticated: boolean
  userType: string | null
}

const initialState: UserState = {
  email: null,
  token: null,
  role: null,
  isAuthenticated: false,
  userType: null,
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload
    },
    setCredentials: (state, action: PayloadAction<{ email: string; token: string; role: string }>) => {
      const { email, token, role } = action.payload
      state.email = email
      state.token = token
      state.role = role
      state.isAuthenticated = true
    },
    setUserType: (state, action: PayloadAction<string>) => {
      state.userType = action.payload
    },
    clearUser: (state) => {
      state.email = null
      state.token = null
      state.role = null
      state.isAuthenticated = false
      state.userType = null
    },
  },
  extraReducers: (builder) => {
    // When login is successful, update the user state
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
      state.email = payload.user.email
      state.token = payload.token
      state.role = payload.user.role
      state.isAuthenticated = true
    })

    // When logout is successful, clear the user state
    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
      state.email = null
      state.token = null
      state.role = null
      state.isAuthenticated = false
      state.userType = null
    })
  },
})

export const { setEmail, setCredentials, setUserType, clearUser } = userSlice.actions
export default userSlice.reducer
