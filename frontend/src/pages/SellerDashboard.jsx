import { useState, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import toast from 'react-hot-toast'
import DeleteIcon from '@mui/icons-material/Delete'

const SellerDashboard = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products/seller', {
        credentials: 'include'
      })
      const data = await res.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!res.ok) throw new Error('Failed to delete product')
      
      toast.success('Product deleted successfully')
      fetchProducts()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete product')
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
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Seller Dashboard</h1>
        <p className="text-indigo-100">Manage your products and track your sales</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
          <p className="text-3xl font-bold text-indigo-600">{products.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Sales</h3>
          <p className="text-3xl font-bold text-green-600">₹2,405</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm font-medium">Active Orders</h3>
          <p className="text-3xl font-bold text-orange-600">8</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Your Products</h2>
          <RouterLink
            to="/add-product"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add Product
          </RouterLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product._id} className="bg-white border rounded-xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="aspect-w-16 aspect-h-9 rounded-t-xl overflow-hidden">
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
                <div className="flex justify-between items-center mb-6">
                  <span className="text-3xl font-bold text-indigo-600">₹{product.price}</span>
                  <span className="text-sm text-gray-500">Stock: {product.quantity}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <RouterLink
                    to={`/edit-product/${product._id}`}
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-lg"
                  >
                    Edit
                  </RouterLink>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-rose-600 hover:text-rose-800 p-2 rounded-full hover:bg-rose-50 transition-colors"
                  >
                    <DeleteIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SellerDashboard 