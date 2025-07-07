import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import storehouseReducer from './slices/storehouseSlice'
import productReducer from './slices/productSlice'
import inquiryReducer from './slices/inquirySlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    storehouse: storehouseReducer,
    product: productReducer,
    inquiry: inquiryReducer,
  },
})

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Create typed hooks
import { useDispatch, useSelector } from 'react-redux'
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()