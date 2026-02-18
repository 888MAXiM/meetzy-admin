import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { LayoutStateProps } from '../../types/layout'

const initialState: LayoutStateProps = {
  sideBarToggle: true,
}

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setSidebarToggle: (state, action: PayloadAction<boolean | undefined>) => {
      state.sideBarToggle = typeof action.payload === 'boolean' ? action.payload : !state.sideBarToggle
    }
  },
})

export const { setSidebarToggle } = layoutSlice.actions
export default layoutSlice.reducer
