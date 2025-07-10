'use client'

import { useAuth } from '../contexts/AuthContext'
import AuthForm from './AuthForm'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Agricultural SWOT Analysis
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sign in to access comprehensive SWOT analysis for agricultural crops.
            </p>
          </div>
          <AuthForm />
        </div>
      </div>
    )
  }

  return <>{children}</>
} 