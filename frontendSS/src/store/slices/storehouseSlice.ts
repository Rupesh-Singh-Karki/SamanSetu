import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
//axios is a popular JavaScript library used to make HTTP requests (like GET, POST, PUT, DELETE) to a server or an API.
import toast from 'react-hot-toast'
//It's a library that helps you show toast notifications in your React app — like popup messages that say:
import type { RootState } from '../store'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// createAsyncThunk is a helper function provided by Redux Toolkit to handle
// async operations (like API calls) in Redux more easily.

export interface Storehouse {
  id: number
  name: string
  description?: string
  location?: string
  owner_id: number
  created_at: string
}

interface StorehouseState {
  storehouses: Storehouse[]
  loading: boolean
  error: string | null
}

const initialState: StorehouseState = {
  storehouses: [],
  loading: false,
  error: null,
}


// 1st param: action name
// 2nd param: async function to run
export const fetchStorehouses = createAsyncThunk(
  'storehouse/fetchStorehouses', //Action name
  async (_, { getState }) => {
    const state = getState() as RootState
    const { user, token } = state.auth
    
    if (!user || !token) throw new Error('No authentication')
    
    const response = await axios.get(`${API_URL}/owners/${user.id}/storehouses`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
)

export const createStorehouse = createAsyncThunk(
  'storehouse/createStorehouse',
  async (
    { name, description, location }: { name: string; description?: string; location?: string },
    { getState }
  ) => {
    const state = getState() as RootState
    const { user, token } = state.auth
    
    if (!user || !token) throw new Error('No authentication')
    
    const response = await axios.post(
      `${API_URL}/owners/${user.id}/storehouses`,
      { name, description, location },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
  }
)

export const searchStorehouses = createAsyncThunk(
  'storehouse/searchStorehouses',
  async (query: string, { getState }) => {
    const state = getState() as RootState
    const { user, token } = state.auth
    
    if (!user || !token) throw new Error('No authentication')
    
    const response = await axios.get(
      `${API_URL}/owners/${user.id}/storehouses/search?q=${encodeURIComponent(query)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
  }
)

const storehouseSlice = createSlice({
  name: 'storehouse',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStorehouses.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStorehouses.fulfilled, (state, action) => {
        state.loading = false
        state.storehouses = action.payload
      })
      .addCase(fetchStorehouses.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch storehouses'
        toast.error(action.error.message || 'Failed to fetch storehouses')
      })
      .addCase(createStorehouse.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createStorehouse.fulfilled, (state, action) => {
        state.loading = false
        state.storehouses.push(action.payload)
        toast.success('Storehouse created successfully!')
      })
      .addCase(createStorehouse.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to create storehouse'
        toast.error(action.error.message || 'Failed to create storehouse')
      })

      // Search storehouses
      // This handles the search functionality for storehouses.
      .addCase(searchStorehouses.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchStorehouses.fulfilled, (state, action) => {
        state.loading = false
        state.storehouses = action.payload
      })
      .addCase(searchStorehouses.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to search storehouses'
        toast.error(action.error.message || 'Failed to search storehouses')
      })
  },
})

export const { clearError } = storehouseSlice.actions
export default storehouseSlice.reducer