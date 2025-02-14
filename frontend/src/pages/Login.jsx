import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import toast from 'react-hot-toast'
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  CircularProgress
} from '@mui/material'
import LoginIcon from '@mui/icons-material/Login'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const user = await login(formData.email, formData.password)
      toast.success('Logged in successfully!')
      navigate(user.isSeller ? '/dashboard' : '/customer/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.message || 'Failed to login')
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
          <LoginIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
          <Typography component="h1" variant="h5" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please sign in to your account
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
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
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" align="center">
            Don&apos;t have an account?{' '}
            <Link component={RouterLink} to="/signup" color="primary">
              Sign up
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  )
}

export default Login
