import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import PersonIcon from '@mui/icons-material/Person'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import DashboardIcon from '@mui/icons-material/Dashboard'
import LogoutIcon from '@mui/icons-material/Logout'

const Navigation = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex items-center font-['Orbitron'] text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text"
          >
            <ShoppingCartIcon className="mr-2" />
            LaunchSphere
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to={user.isSeller ? "/dashboard" : "/customer/dashboard"}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <DashboardIcon className="mr-1" />
                  <span className="hidden md:inline">Dashboard</span>
                </Link>
                
                {user.isSeller && (
                  <Link
                    to="/add-product"
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    <AddCircleIcon className="mr-1" />
                    <span className="hidden md:inline">Add Product</span>
                  </Link>
                )}
                
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <PersonIcon className="mr-1" />
                  <span className="hidden md:inline">Profile</span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-rose-600 border border-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-colors"
                >
                  <LogoutIcon className="mr-1" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation 