import { Link as RouterLink } from 'react-router-dom'
import {
  Container,
  Typography,
  Button,
  Paper
} from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import HomeIcon from '@mui/icons-material/Home'

const NotFound = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 2
        }}
      >
        <ErrorOutlineIcon
          sx={{
            fontSize: 100,
            color: 'error.main',
            mb: 2
          }}
        />
        <Typography variant="h4" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </Typography>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          startIcon={<HomeIcon />}
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Paper>
    </Container>
  )
}

export default NotFound
