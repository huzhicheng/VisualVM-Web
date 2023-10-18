/**
 * Redux
 * https://cn.redux.js.org/introduction/why-rtk-is-redux-today
 */
import { configureStore } from '@reduxjs/toolkit';
import globalReducer from './globalSlice';
import menuReducer from './menuSlice';



const store = configureStore({
  reducer: {
    global: globalReducer,
    menu: menuReducer
  }
})

export default store