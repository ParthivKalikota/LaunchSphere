import { Navigate, Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const SellerRoute = () => {
  const [isSeller, setIsSeller] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkSeller = async () => {
      try {
        const res = await fetch('/api/auth/check', {
          credentials: 'include'
        })
        const data = await res.json()
        
        if (!data.user) {
          setIsAuthenticated(false)
          setIsSeller(false)
          return
        }

        setIsAuthenticated(true)
        setIsSeller(data.user.isSeller)
      } catch (error) {
        console.error('Seller check failed:', error)
        setIsAuthenticated(false)
        setIsSeller(false)
      } finally {
        setLoading(false)
      }
    }

    checkSeller()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isSeller) {
    toast.error('Access denied. Seller account required.')
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default SellerRoute 