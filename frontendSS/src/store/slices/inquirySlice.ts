import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import toast from 'react-hot-toast'
import type { RootState } from '../store'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface Inquiry {
  id: number
  product_id: number
  buyer_id: number
  message: string
  quantity: number
  created_at: string
}

interface InquiryState {
  inquiries: Inquiry[]
  loading: boolean
  error: string | null
}

const initialState: InquiryState = {
  inquiries: [],
  loading: false,
  error: null,
}

export const createInquiry = createAsyncThunk(
  'inquiry/createInquiry',
  async (data: { 
    product_id: number; 
    message: string; 
    quantity: number 
  }, { getState }) => {
    const state = getState() as RootState
    const { token } = state.auth
    
    if (!token) throw new Error('No authentication')
    
    const response = await axios.post(
      `${API_URL}/products/${data.product_id}/inquiry`,
      {
        message: data.message,
        quantity: data.quantity
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
  }
)

const inquirySlice = createSlice({
  name: 'inquiry',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createInquiry.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createInquiry.fulfilled, (state) => {
        state.loading = false
        toast.success('Inquiry sent successfully!')
      })
      .addCase(createInquiry.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to send inquiry'
        toast.error(action.error.message || 'Failed to send inquiry')
      })
  },
})

export const { clearError } = inquirySlice.actions
export default inquirySlice.reducer