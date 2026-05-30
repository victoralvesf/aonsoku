import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import 'react-lazy-load-image-component/src/effects/opacity.css'
import 'react-toastify/dist/ReactToastify.css'

import '@fontsource/poppins/100.css'
import '@fontsource/poppins/100-italic.css'
import '@fontsource/poppins/200.css'
import '@fontsource/poppins/200-italic.css'
import '@fontsource/poppins/300.css'
import '@fontsource/poppins/300-italic.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/400-italic.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/500-italic.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/600-italic.css'
import '@fontsource/poppins/700.css'
import '@fontsource/poppins/700-italic.css'
import '@fontsource/poppins/800.css'
import '@fontsource/poppins/800-italic.css'
import '@fontsource/poppins/900.css'
import '@fontsource/poppins/900-italic.css'

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

// Lazy-load CJK font CSS off the critical path. Keeps the main bundle CSS
// small while still letting the browser use unicode-range to fetch only the
// woff2 subsets actually needed for whatever CJK glyphs appear in the user's
// library.
Promise.all([
  import('@fontsource/noto-sans-sc/400.css'),
  import('@fontsource/noto-sans-sc/600.css'),
  import('@fontsource/noto-sans-hk/400.css'),
  import('@fontsource/noto-sans-hk/600.css'),
  import('@fontsource/noto-sans-jp/400.css'),
  import('@fontsource/noto-sans-jp/600.css'),
  import('@fontsource/noto-sans-kr/400.css'),
  import('@fontsource/noto-sans-kr/600.css'),
])
