import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useCart } from '../hooks/use-cart'

const CustomerDashboard = () => {
  const navigate = useNavigate()
  const { addToCart, cartItems } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5001/api/products', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleAddToCart = (product) => {
    if (!cartItems.some(item => item._id === product._id)) {
      addToCart(product)
    }
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
      {/* Header with Cart Button */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back!</h1>
            <p className="text-indigo-100">Discover and shop amazing products</p>
          </div>
          <button
            onClick={() => navigate('/cart')}
            className="bg-white text-indigo-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-50 transition-colors"
          >
            <ShoppingCartIcon />
            <span>Cart ({cartItems.length})</span>
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-w-16 aspect-h-9">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{product.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-indigo-600">₹{product.price.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">Stock: {product.quantity}</span>
                </div>
                
                <button
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                  onClick={() => handleAddToCart(product)}
                  disabled={cartItems.some(item => item._id === product._id)}
                >
                  <AddShoppingCartIcon className="w-5 h-5" />
                  {cartItems.some(item => item._id === product._id) 
                    ? 'In Cart' 
                    : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CustomerDashboard 