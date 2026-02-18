import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { STORAGE_KEYS } from '../../constants'
import { getStorage, stringify } from '../../utils'
import type { AuthState, User } from '../../types/store'

const storage = getStorage()
const storedUser = storage.getItem(STORAGE_KEYS.USER)

const initialState: AuthState = {
  token: storage.getItem(STORAGE_KEYS.TOKEN) || null,
  user: storedUser ? (JSON.parse(storedUser) as User) : null,
  isAuthenticated: !!storage.getItem(STORAGE_KEYS.TOKEN),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token
      state.user = action.payload.user
      state.isAuthenticated = true
      storage.setItem(STORAGE_KEYS.USER, stringify(action.payload.user))
      storage.setItem(STORAGE_KEYS.TOKEN, action.payload.token)
    },
    logout: (state) => {
      state.token = null
      state.user = null
      state.isAuthenticated = false
      storage.clear()
    },
    setForgotPasswordEmail: (_state, action: PayloadAction<string>) => {
      storage.setItem(STORAGE_KEYS.FORGOT_PASSWORD_EMAIL, action.payload)
    },
    clearForgotPasswordEmail: () => {
      storage.removeItem(STORAGE_KEYS.FORGOT_PASSWORD_EMAIL)
      storage.removeItem(STORAGE_KEYS.OTP_TOKEN)
      storage.removeItem(STORAGE_KEYS.RESEND_COOLDOWN_KEY)
    },
  },
})

export const { loginSuccess, logout, clearForgotPasswordEmail, setForgotPasswordEmail } = authSlice.actions

export default authSlice.reducer
