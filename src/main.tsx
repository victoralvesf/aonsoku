import React from 'react'
import ReactDOM from 'react-dom/client'

import 'react-toastify/dist/ReactToastify.css'
import '@/fonts.css'
import '@/index.css'

import '@/i18n'

import App from '@/App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
