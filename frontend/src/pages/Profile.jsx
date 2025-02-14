import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import toast from 'react-hot-toast'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import StorefrontIcon from '@mui/icons-material/Storefront'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'

const Profile = () => {
  const navigate = useNavigate()
  const { user, setUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const formRef = useRef(null)
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  })

  const fetchProfile = useCallback(async () => {
    console.log('Current user:', user)

    if (!user) {
      console.log('No user found, redirecting to login')
      setLoading(false)
      navigate('/login')
      return
    }

    try {
      console.log('Fetching profile with token:', user.token)
      const res = await fetch('/api/users/profile', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      })
      
      console.log('Response status:', res.status)
      const contentType = res.headers.get('content-type')
      console.log('Content type:', contentType)

      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response')
      }
      
      const data = await res.json()
      console.log('Profile data:', data)
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to load profile')
      }
      
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile. Please try again.')
      if (error.message.includes('unauthorized')) {
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }, [user, navigate])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone || ''
        })
      })

      const text = await res.text()
      const data = text ? JSON.parse(text) : {}

      if (!res.ok) {
        throw new Error(data.message || 'Error updating profile')
      }

      setUser({
        ...user,
        ...data
      })
      setIsEditing(false)
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Update profile error:', error)
      toast.error(error.message || 'Failed to update profile')
    }
  }

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || ''
    })
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
        <p className="text-indigo-100">View and manage your account details</p>
      </div>

      {/* Profile Card */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="p-8 sm:p-10 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-100 rounded-full p-3">
                <PersonIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{profile?.name}</h2>
                <p className="text-gray-500">{profile?.isSeller ? 'Seller Account' : 'Customer Account'}</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8 sm:p-10 space-y-6">
            {/* Email */}
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 rounded-full p-2">
                <EmailIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="text-lg font-medium text-gray-800">{profile?.email}</p>
              </div>
            </div>

            {/* Account Type */}
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 rounded-full p-2">
                <StorefrontIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Type</p>
                <p className="text-lg font-medium text-gray-800">
                  {profile?.isSeller ? 'Seller' : 'Customer'}
                </p>
              </div>
            </div>

            {/* Join Date */}
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 rounded-full p-2">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="text-lg font-medium text-gray-800">
                  {new Date(profile?.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-8 sm:px-10 py-6 bg-gray-50 border-t border-gray-200">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <EditIcon /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="max-w-2xl mx-auto mt-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
            </div>

            <form ref={formRef} onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  ) : (
                    <p className="text-gray-900">{user?.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  ) : (
                    <p className="text-gray-900">{user?.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.phone || 'Not provided'}</p>
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-4 mt-6">
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <SaveIcon /> Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <CancelIcon /> Cancel
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
