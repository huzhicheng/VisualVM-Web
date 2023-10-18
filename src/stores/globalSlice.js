import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAttachJvm: false,
    rightLicense: true,
}

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setAttachJvm(state, action) {
      const isAttachJvm = action.payload
      state.isAttachJvm = isAttachJvm;
      console.log(`globalSlice ${state.isAttachJvm}`);
    },
    setRightLicense(state, action) {
      const rightLicense = action.payload
      state.rightLicense = rightLicense;
    }
  }
})

export const { setAttachJvm, setRightLicense } = globalSlice.actions

export default globalSlice.reducer