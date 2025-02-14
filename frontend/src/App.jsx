import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './components/AuthProvider'
import { CartProvider } from './context/cart-provider'
import theme from './theme'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import SellerDashboard from './pages/SellerDashboard'
import CustomerDashboard from './pages/CustomerDashboard'
import AddProduct from './pages/AddProduct'
import ProductDetails from './pages/ProductDetails'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import PrivateRoute from './components/PrivateRoute'
import SellerRoute from './components/SellerRoute'
import EditProduct from './pages/EditProduct'
import Navigation from './components/Navigation'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Sales from './pages/Sales'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1 mt-16">
              <Toaster 
                position="top-center"
                toastOptions={{
                  style: {
                    background: '#333',
                    color: '#fff',
                  },
                }}
              />
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/cart" element={<Cart />} />
                  
                  {/* Protected Routes */}
                  <Route element={<PrivateRoute />}>
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/profile" element={<Profile />} />
                    
                    {/* Seller Routes */}
                    <Route element={<SellerRoute />}>
                      <Route path="/dashboard" element={<SellerDashboard />} />
                      <Route path="/add-product" element={<AddProduct />} />
                      <Route path="/edit-product/:id" element={<EditProduct />} />
                      <Route path="/sales" element={<Sales />} />
                    </Route>

                    {/* Customer Routes */}
                    <Route path="/customer/dashboard" element={<CustomerDashboard />} />
                    <Route path="/orders" element={<Orders />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </CartProvider>
    </ThemeProvider>
  )
}

export default App
