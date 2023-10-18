import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isLeftMenu: false
}

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    menuToggle(state, action) {
      state.isLeftMenu = !state.isLeftMenu;
    }
  }
})

export const { menuToggle } = menuSlice.actions

export default menuSlice.reducer