import { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import toast from 'react-hot-toast'
import { CartContext } from './cart-context'

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])

  const addToCart = useCallback((product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id)
      
      if (existingItem) {
        return prevItems
      }
      
      toast.success('Added to cart')
      return [...prevItems, { ...product, quantity: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((productId) => {
    setCartItems(prevItems => {
      const itemExists = prevItems.some(item => item._id === productId)
      if (itemExists) {
        toast.success('Removed from cart')
      }
      return prevItems.filter(item => item._id !== productId)
    })
  }, [])

  const updateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity < 1) return
    setCartItems(prevItems => 
      prevItems.map(item =>
        item._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired
} 