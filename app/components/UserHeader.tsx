'use client'

import { useAuth } from '../contexts/AuthContext'

export default function UserHeader() {
  const { user, signOut } = useAuth()

  return (
    <div className="flex justify-between items-center mb-8 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold">
            {user?.email?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="text-sm text-gray-600">Welcome back,</p>
          <p className="font-medium text-gray-900">{user?.email}</p>
        </div>
      </div>
      
      <button
        onClick={signOut}
        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
      >
        Sign Out
      </button>
    </div>
  )
} 