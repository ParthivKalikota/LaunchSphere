import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/use-cart'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import InventoryIcon from '@mui/icons-material/Inventory'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const CustomerDashboard = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { cartItems, addToCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products', {
        credentials: 'include'
      })
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleButtonClick = (product) => {
    if (cartItems.some(item => item._id === product._id)) {
      navigate('/cart')
    } else {
      addToCart(product)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Available Products</h1>
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-md p-8">
          <InventoryIcon className="text-gray-400 text-6xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No Products Available</h2>
          <p className="text-gray-500">Check back later for new products</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <InventoryIcon className="text-gray-400 text-4xl" />
                  </div>
                )}
                {product.quantity === 0 && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 m-2 rounded-full">
                    Out of Stock
                  </div>
                )}
              </div>
              <div className="p-4">
                <Link to={`/product/${product._id}`}>
                  <h2 className="text-xl font-semibold mb-2 hover:text-indigo-600 transition-colors">
                    {product.name}
                  </h2>
                </Link>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold">₹{product.price.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">
                    {product.quantity > 0 ? `${product.quantity} left` : 'Out of Stock'}
                  </span>
                </div>
                <div className="space-y-2">
                  <Link
                    to={`/product/${product._id}`}
                    className="w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleButtonClick(product)}
                    disabled={product.quantity === 0}
                    className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
                      product.quantity === 0
                        ? 'bg-gray-300 cursor-not-allowed'
                        : cartItems.some(item => item._id === product._id)
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {product.quantity === 0 ? (
                      'Out of Stock'
                    ) : cartItems.some(item => item._id === product._id) ? (
                      <>
                        <ShoppingCartIcon />
                        Go to Cart
                      </>
                    ) : (
                      <>
                        <AddShoppingCartIcon />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomerDashboard 