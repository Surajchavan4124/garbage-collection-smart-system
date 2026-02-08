import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PanchayatProvider } from './context/PanchayatContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PanchayatProvider>
      <App />
    </PanchayatProvider>
  </StrictMode>
)
