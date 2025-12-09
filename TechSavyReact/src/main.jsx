import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './assets/AuthContext.jsx'
import { LoaderProvider } from './assets/LoaderContext.jsx'
import { CartProvider } from './assets/CartContext.jsx'
import GlobalLoader from './Components/GlobalLoader.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoaderProvider>
      <GlobalLoader />
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </LoaderProvider>
  </StrictMode>,
)
