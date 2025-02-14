import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  CircularProgress,
  InputAdornment
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import InventoryIcon from '@mui/icons-material/Inventory'
import ImageIcon from '@mui/icons-material/Image'

const EditProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    image: ''
  })

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`, {
          credentials: 'include'
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message)
        setFormData(data)
      } catch (error) {
        console.error('Error fetching product:', error)
        toast.error('Failed to load product')
        navigate('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to update product')
      }

      toast.success('Product updated successfully')
      navigate('/dashboard')
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error(error.message || 'Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4, mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <EditIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" component="h1">
            Edit Product
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Price (₹)"
                name="price"
                value={formData.price}
                onChange={handleChange}
                variant="outlined"
                inputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      ₹
                    </InputAdornment>
                  ),
                }}
                placeholder="Enter price in ₹"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <InventoryIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                name="image"
                value={formData.image}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ImageIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => navigate('/dashboard')}
                  startIcon={<ArrowBackIcon />}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                  startIcon={saving ? <CircularProgress size={20} /> : <EditIcon />}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  )
}

export default EditProduct 