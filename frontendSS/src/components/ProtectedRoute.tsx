import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'

const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) => {
  const { user, token } = useSelector((state: RootState) => state.auth)
  const location = useLocation()
  
  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />
  }
  
  return <>{children}</>
}

export default ProtectedRoute