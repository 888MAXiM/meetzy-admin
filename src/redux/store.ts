import { configureStore } from '@reduxjs/toolkit'
import authSlice from './reducers/authSlice'
import layoutSlice from './reducers/layoutSlice'
import loaderSlice from './reducers/loaderSlice'
import settingSlice from './reducers/settingSlice'

const Store = configureStore({
  reducer: {
    auth: authSlice,
    layout: layoutSlice,
    loader: loaderSlice,
    setting: settingSlice,
  },
})

export default Store

export type RootState = ReturnType<typeof Store.getState>
export type AppDispatch = typeof Store.dispatch
