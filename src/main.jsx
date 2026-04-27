import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'
import { attachTokenToAxios } from './utils/auth'

// Attach auth token (if present) to all axios requests
try {
  attachTokenToAxios(axios);
} catch (e) {
  // non-fatal
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
