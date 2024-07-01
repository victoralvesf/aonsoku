import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import 'react-toastify/dist/ReactToastify.css'
import '@/fonts.css'
import '@/index.css'

import '@/i18n'

import App from '@/App'

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
