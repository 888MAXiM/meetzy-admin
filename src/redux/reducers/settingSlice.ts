import { createSlice } from '@reduxjs/toolkit'
import type { SettingsState } from '../../types/api'

const initialState: SettingsState = {
  settings: null,
  sidebar_logo_url: '',
  logo_light_url: '',
  logo_dark_url: '',
  mail_encryption: '',
}

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    setSetting: (state, action) => {
      state.settings = action.payload
      state.sidebar_logo_url = action.payload.settings.sidebar_logo_url
      state.logo_light_url = action.payload.settings.logo_light_url
      state.logo_dark_url = action.payload.settings.logo_dark_url
      state.mail_encryption = action.payload.settings.logo_dark_url
    },
  },
})

export const { setSetting } = settingSlice.actions

export default settingSlice.reducer
