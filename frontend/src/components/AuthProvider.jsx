import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import toast from 'react-hot-toast'
import { AuthContext } from '../context/authContext'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkAuthStatus = async () => {
    try {
      console.log('Checking auth status...');
      const res = await fetch('/api/auth/check', {
        credentials: 'include'
      })
      
      console.log('Auth check response status:', res.status);
      
      // Try to get the response text first
      const text = await res.text();
      console.log('Raw response:', text);
      
      // Only try to parse as JSON if we have content
      const data = text ? JSON.parse(text) : {};
      
      if (data.user) {
        console.log('User found:', data.user);
        setUser(data.user)
      } else {
        console.log('No user found in response');
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      console.log('Attempting login...');
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      })

      console.log('Login response status:', res.status);
      
      // Try to get the response text first
      const text = await res.text();
      console.log('Raw login response:', text);
      
      // Only try to parse as JSON if we have content
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        throw new Error(data.message || 'Login failed')
      }

      if (!data.user) {
        throw new Error('Invalid response format')
      }

      console.log('Login successful:', data.user);
      setUser(data.user)
      return data.user
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.message || 'Login failed')
      throw error
    }
  }

  const logout = async () => {
    try {
      console.log('Attempting logout...');
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })

      console.log('Logout response status:', res.status);

      if (!res.ok) {
        throw new Error('Logout failed')
      }

      setUser(null)
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout failed:', error)
      toast.error('Failed to logout')
      throw error
    }
  }

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuthStatus
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
} 