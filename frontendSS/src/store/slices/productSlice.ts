import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import toast from 'react-hot-toast'
import type { RootState } from '../store'
import type { User } from './authSlice'
import type { Storehouse } from './storehouseSlice'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface Product {
  id: number
  name: string
  total_quantity: number
  quantity_sold: number
  price_per_unit: number
  revenue: number
  description?: string
  storehouse_id: number
  owner_id: number
  created_at: string
  updated_at: string
  available_quantity: number
  owner?: User
  storehouse?: Storehouse
}

interface ProductState {
  products: Product[]
  allProducts: Product[]
  loading: boolean
  error: string | null
}

const initialState: ProductState = {
  products: [],
  allProducts: [],
  loading: false,
  error: null,
}

export const fetchProductsByStorehouse = createAsyncThunk(
  'product/fetchProductsByStorehouse',
  async (storehouseId: number, { getState }) => {
    const state = getState() as RootState
    const { token } = state.auth
    
    if (!token) throw new Error('No authentication')
    
    const response = await axios.get(`${API_URL}/storehouses/${storehouseId}/products`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
)

export const fetchAllProducts = createAsyncThunk(
  'product/fetchAllProducts',
  async (_, { getState }) => {
    const state = getState() as RootState
    const { user, token } = state.auth
    
    if (!user || !token) throw new Error('No authentication')
    
    const response = await axios.get(`${API_URL}/products`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
)

export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (data: { 
    name: string; 
    total_quantity: number; 
    price_per_unit: number; 
    quantity_sold: number;
    description?: string; 
    storehouse_id: number 
  }, { getState }) => {
    const state = getState() as RootState
    const { token } = state.auth
    
    if (!token) throw new Error('No authentication')
    
    const response = await axios.post(
      `${API_URL}/storehouses/${data.storehouse_id}/products`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
  }
)

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async (data: { 
    id: number; 
    name?: string; 
    total_quantity?: number; 
    price_per_unit?: number; 
    quantity_sold?: number;
    description?: string; 
  }, { getState }) => {
    const state = getState() as RootState
    const { token } = state.auth
    
    if (!token) throw new Error('No authentication')
    
    const response = await axios.put(
      `${API_URL}/products/${data.id}`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
  }
)

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (productId: number, { getState }) => {
    const state = getState() as RootState
    const { token } = state.auth
    
    if (!token) throw new Error('No authentication')
    
    await axios.delete(`${API_URL}/products/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return productId
  }
)

export const searchProducts = createAsyncThunk(
  'product/searchProducts',
  async (query: string, { getState }) => {
    const state = getState() as RootState
    const { token } = state.auth
    
    if (!token) throw new Error('No authentication')
    
    const response = await axios.get(`${API_URL}/products/search?q=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
)

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch by storehouse
      .addCase(fetchProductsByStorehouse.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductsByStorehouse.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
      })
      .addCase(fetchProductsByStorehouse.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch storehouse products'
        toast.error(action.error.message || 'Failed to fetch storehouse products')
      })
      
      // Fetch all products
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false
        state.allProducts = action.payload
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch all products'
        toast.error(action.error.message || 'Failed to fetch all products')
      })
      
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false
        state.products.push(action.payload)
        state.allProducts.push(action.payload)
        toast.success('Product created successfully!')
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to create product'
        toast.error(action.error.message || 'Failed to create product')
      })
      
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false
        // Update in products array
        const productIndex = state.products.findIndex(p => p.id === action.payload.id)
        if (productIndex !== -1) {
          state.products[productIndex] = action.payload
        }
        // Update in allProducts array
        const allProductIndex = state.allProducts.findIndex(p => p.id === action.payload.id)
        if (allProductIndex !== -1) {
          state.allProducts[allProductIndex] = action.payload
        }
        toast.success('Product updated successfully!')
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to update product'
        toast.error(action.error.message || 'Failed to update product')
      })
      
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false
        state.products = state.products.filter(p => p.id !== action.payload)
        state.allProducts = state.allProducts.filter(p => p.id !== action.payload)
        toast.success('Product deleted successfully!')
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to delete product'
        toast.error(action.error.message || 'Failed to delete product')
      })

      // Search products
      .addCase(searchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.allProducts = action.payload
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to search products'
        toast.error(action.error.message || 'Failed to search products')
      })
  },
})

export const { clearError } = productSlice.actions
export default productSlice.reducer