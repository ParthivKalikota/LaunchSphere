import { useState, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import toast from 'react-hot-toast'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import StorefrontIcon from '@mui/icons-material/Storefront'

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products')
        const data = await res.json()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
        toast.error('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-700 text-white mb-12">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-[url('/path/to/pattern.png')] opacity-10"></div>
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2">
            <div className="relative p-8 md:p-16 min-h-[500px] flex flex-col justify-center">
              <h1 className="font-['Orbitron'] text-5xl md:text-6xl font-bold mb-6 tracking-wider">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-rose-400 to-pink-600 text-transparent bg-clip-text">
                  LaunchSphere
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-10 text-gray-200 max-w-xl">
                Discover amazing products from our trusted sellers in the digital marketplace
              </p>
              <RouterLink
                to="/signup"
                className="group inline-flex items-center px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl w-fit"
              >
                <StorefrontIcon className="mr-2 group-hover:animate-bounce" />
                <span className="font-semibold">Get Started</span>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-['Orbitron'] font-bold mb-12 text-center text-gray-800">
          Featured Products
        </h2>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <ShoppingCartIcon className="w-20 h-20 text-gray-400 mb-6 mx-auto" />
            <h3 className="text-2xl text-gray-600 font-semibold">No products available</h3>
            <p className="text-gray-500 mt-2">Check back later for new products</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-lg hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl"
              >
                {product.image && (
                  <div className="relative overflow-hidden rounded-t-xl">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-56 object-cover transform hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-800">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <div>
                      <p className="text-2xl font-bold text-indigo-600">${product.price}</p>
                      <p className="text-sm text-gray-500">
                        {product.quantity > 0 ? (
                          <span className="text-emerald-600">{product.quantity} in stock</span>
                        ) : (
                          <span className="text-rose-600">Out of stock</span>
                        )}
                      </p>
                    </div>
                    <RouterLink
                      to={`/product/${product._id}`}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-colors font-semibold hover:shadow-lg"
                    >
                      View Details
                    </RouterLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
