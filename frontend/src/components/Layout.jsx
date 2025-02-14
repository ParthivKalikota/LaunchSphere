import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navigation from './Navigation'

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <Navigation />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
