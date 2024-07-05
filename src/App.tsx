import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { PlaylistProvider } from '@/app/contexts/playlists-context'
import { RadiosProvider } from '@/app/contexts/radios-context'
import { LangObserver } from '@/app/observers/lang-observer'
import { ThemeObserver } from '@/app/observers/theme-observer'
import { router } from '@/routes/router'

function App() {
  return (
    <PlaylistProvider>
      <RadiosProvider>
        <LangObserver />
        <ThemeObserver />
        <RouterProvider router={router} />
        <ToastContainer theme="colored" />
      </RadiosProvider>
    </PlaylistProvider>
  )
}

export default App
