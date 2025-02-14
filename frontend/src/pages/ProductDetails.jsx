import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useCart } from '../hooks/use-cart'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import InventoryIcon from '@mui/icons-material/Inventory'
import PersonIcon from '@mui/icons-material/Person'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const { cartItems, addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`, {
          credentials: 'include'
        })
        if (!res.ok) {
          throw new Error('Product not found')
        }
        const data = await res.json()
        setProduct(data)
      } catch (error) {
        console.error('Error fetching product:', error)
        toast.error('Failed to load product details')
        navigate(-1)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, navigate])

  const handleButtonClick = () => {
    if (cartItems.some(item => item._id === product._id)) {
      navigate('/cart')
    } else {
      addToCart(product)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    )
  }

  if (!product) {
    return null
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        onClick={() => navigate(-1)}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 4 }}
      >
        Back
      </Button>

      <Paper elevation={3}>
        <Grid container>
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: '100%',
                minHeight: 400,
                position: 'relative',
                backgroundColor: 'grey.100'
              }}
            >
              {product.image ? (
                <Box
                  component="img"
                  src={product.image}
                  alt={product.name}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography color="text.secondary">No image available</Typography>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {product.name}
              </Typography>

              <Box sx={{ my: 3 }}>
                <Chip
                  icon={<LocalOfferIcon />}
                  label={`₹${product.price.toLocaleString()}`}
                  color="primary"
                  sx={{ mr: 1, fontSize: '1.2rem' }}
                />
                <Chip
                  icon={<InventoryIcon />}
                  label={`${product.quantity} in stock`}
                  variant="outlined"
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {product.description}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Seller Information
                </Typography>
                <Chip
                  icon={<PersonIcon />}
                  label={product.seller?.fullName || 'Unknown Seller'}
                  variant="outlined"
                  size="small"
                />
              </Box>

              <button
                onClick={handleButtonClick}
                disabled={product.quantity === 0}
                className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
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
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

export default ProductDetails 