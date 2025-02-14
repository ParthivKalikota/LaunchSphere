import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  FormControlLabel,
  Checkbox,
  CircularProgress
} from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const Signup = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    isSeller: false
  })

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Signup failed')
      }

      toast.success('Account created successfully!')
      navigate('/login')
    } catch (error) {
      console.error('Signup error:', error)
      toast.error(error.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <PersonAddIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
          <Typography component="h1" variant="h5" gutterBottom>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Join our marketplace today
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="fullName"
              label="Full Name"
              name="fullName"
              autoComplete="name"
              autoFocus
              value={formData.fullName}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="isSeller"
                  checked={formData.isSeller}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="Register as a seller"
              sx={{ mt: 2 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Account'}
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" align="center">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" color="primary">
              Sign in
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  )
}

export default Signup
