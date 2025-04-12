import { isDesktop } from 'react-device-detect'
import { RouterProvider } from 'react-router-dom'
import { SettingsDialog } from '@/app/components/settings/dialog'
import { LangObserver } from '@/app/observers/lang-observer'
import { MediaSessionObserver } from '@/app/observers/media-session-observer'
import { ThemeObserver } from '@/app/observers/theme-observer'
import { ToastContainer } from '@/app/observers/toast-container'
import { Mobile } from '@/app/pages/mobile'
import { router } from '@/routes/router'

function App() {
  if (!isDesktop && window.innerHeight > window.innerWidth) return <Mobile /> // Support tablets but not phones

  return (
    <>
      <MediaSessionObserver />
      <LangObserver />
      <ThemeObserver />
      <SettingsDialog />
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  )
}

export default App
