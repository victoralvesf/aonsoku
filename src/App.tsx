import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AppContextProvider } from '@/app/contexts/app-context'
import { PlaylistProvider } from '@/app/contexts/playlists-context'
import { RadiosProvider } from '@/app/contexts/radios-context'
import { ThemeProvider } from '@/app/contexts/theme-context'
import { router } from '@/routes/router'
import { LangObserver } from './app/observers/lang-observer'

function App() {
  return (
    <AppContextProvider>
      <ThemeProvider>
        <PlaylistProvider>
          <RadiosProvider>
            <LangObserver />
            <RouterProvider router={router} />
            <ToastContainer theme="colored" />
          </RadiosProvider>
        </PlaylistProvider>
      </ThemeProvider>
    </AppContextProvider>
  )
}

export default App
