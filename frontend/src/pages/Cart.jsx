import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/use-cart'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import toast from 'react-hot-toast'
import InventoryIcon from '@mui/icons-material/Inventory'

const Cart = () => {
  const navigate = useNavigate()
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart()

  const handleCheckout = async () => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          products: cartItems.map(item => ({
            _id: item._id,
            quantity: item.quantity
          }))
        })
      })

      const data = await res.json()
      console.log('Order response:', data) // For debugging

      if (!res.ok) {
        throw new Error(data.message || 'Failed to place order')
      }

      clearCart()
      toast.success('Order placed successfully!')
      navigate('/orders')
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error(error.message || 'Failed to place order')
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
          <button
            onClick={() => navigate('/customer/dashboard')}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            <ArrowBackIcon />
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
        <div className="divide-y divide-gray-200">
          {cartItems.map((item) => (
            <div key={item._id} className="py-6 flex items-center gap-4">
              <div className="w-20 h-20">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                    <InventoryIcon className="text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600">₹{item.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="p-1 rounded-full hover:bg-gray-100"
                    disabled={item.quantity <= 1}
                  >
                    <RemoveIcon />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <AddIcon />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <DeleteIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold">₹{cartTotal.toLocaleString()}</span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/customer/dashboard')}
              className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowBackIcon />
              Continue Shopping
            </button>
            <button
              onClick={handleCheckout}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <ShoppingCartCheckoutIcon />
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart 