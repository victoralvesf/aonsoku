import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import 'react-lazy-load-image-component/src/effects/opacity.css'
import 'react-toastify/dist/ReactToastify.css'

import '@/fonts.css'
import '@/themes.css'
import '@/index.css'

import '@/i18n'

import App from '@/App'

import { queryClient } from '@/lib/queryClient'
import { blockFeatures } from '@/utils/browser'

blockFeatures()

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)

// Lazy-load CJK fonts off the critical path from Google Fonts.
const cjkFontLink = document.createElement('link')
cjkFontLink.rel = 'stylesheet'
cjkFontLink.href =
  'https://fonts.googleapis.com/css2' +
  '?family=Noto+Sans+HK:wght@400;600' +
  '&family=Noto+Sans+JP:wght@400;600' +
  '&family=Noto+Sans+KR:wght@400;600' +
  '&family=Noto+Sans+SC:wght@400;600' +
  '&display=swap'
document.head.appendChild(cjkFontLink)
