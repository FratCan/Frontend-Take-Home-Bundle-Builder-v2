import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/fonts.css'
import './styles/tokens.css'
import './styles/global.css'
import App from './App.tsx'
import { BundleProvider } from './data/BundleProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BundleProvider>
      <App />
    </BundleProvider>
  </StrictMode>,
)
