import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface User {
  id: number
  email: string
  role: string
  created_at: string
}

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
}

export const signupOwner = createAsyncThunk(
  'auth/signupOwner',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await axios.post(`${API_URL}/owners/signup`, {
      email,
      password,
    })
    return response.data
  }
)

export const signupBuyer = createAsyncThunk(
  'auth/signupBuyer',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await axios.post(`${API_URL}/buyers/signup`, {
      email,
      password,
    })
    return response.data
  }
)

export const loginOwner = createAsyncThunk(
  'auth/loginOwner',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await axios.post(`${API_URL}/owners/login`, {
      email,
      password,
    })
    return response.data
  }
)

export const loginBuyer = createAsyncThunk(
  'auth/loginBuyer',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await axios.post(`${API_URL}/buyers/login`, {
      email,
      password,
    })
    return response.data
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      toast.success('Logged out successfully')
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupOwner.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signupOwner.fulfilled, (state) => {
        state.loading = false
        toast.success('Owner account created successfully! Please login.')
      })
      .addCase(signupOwner.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Signup failed'
        toast.error(action.error.message || 'Signup failed')
      })
      .addCase(signupBuyer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signupBuyer.fulfilled, (state) => {
        state.loading = false
        toast.success('Buyer account created successfully! Please login.')
      })
      .addCase(signupBuyer.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Signup failed'
        toast.error(action.error.message || 'Signup failed')
      })
      .addCase(loginOwner.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginOwner.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.access_token
        localStorage.setItem('user', JSON.stringify(action.payload.user))
        localStorage.setItem('token', action.payload.access_token)
        toast.success('Login successful!')
      })
      .addCase(loginOwner.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Login failed'
        toast.error(action.error.message || 'Login failed')
      })
      .addCase(loginBuyer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginBuyer.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.access_token
        localStorage.setItem('user', JSON.stringify(action.payload.user))
        localStorage.setItem('token', action.payload.access_token)
        toast.success('Login successful!')
      })
      .addCase(loginBuyer.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Login failed'
        toast.error(action.error.message || 'Login failed')
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer