import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState = {
  email: null as string | null,
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload
    },
    clearUser: (state) => {
      state.email = null
    },
  },
})

export const { setEmail, clearUser } = userSlice.actions
export default userSlice.reducer
