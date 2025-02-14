import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/use-cart'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

const Cart = () => {
  const navigate = useNavigate()
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart()

  const handleQuantityChange = (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change
    updateQuantity(productId, newQuantity)
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <button
            onClick={() => navigate('/customer/dashboard')}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
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
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {cartItems.map((item) => (
            <div key={item._id} className="p-6 flex items-center gap-6">
              <div className="w-24 h-24">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity, -1)}
                    className="p-1 rounded-full hover:bg-gray-100 text-indigo-600"
                  >
                    <RemoveIcon />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity, 1)}
                    className="p-1 rounded-full hover:bg-gray-100 text-indigo-600"
                  >
                    <AddIcon />
                  </button>
                </div>

                <span className="text-lg font-semibold text-indigo-600 min-w-[100px] text-right">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </span>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                >
                  <DeleteIcon />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-semibold text-gray-800">Total:</span>
            <span className="text-2xl font-bold text-indigo-600">
              ₹{cartTotal.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <button
              onClick={() => navigate('/customer/dashboard')}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <ArrowBackIcon />
              Continue Shopping
            </button>
            <button
              onClick={() => navigate('/checkout')}
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