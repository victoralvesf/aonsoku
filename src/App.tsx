import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AppContextProvider } from '@/app/contexts/app-context'
import { LangProvider } from '@/app/contexts/lang-context'
import { PlayerContextProvider } from '@/app/contexts/player-context'
import { PlaylistProvider } from '@/app/contexts/playlists-context'
import { RadiosProvider } from '@/app/contexts/radios-context'
import { ThemeProvider } from '@/app/contexts/theme-context'
import { router } from '@/routes/router'

function App() {
  return (
    <LangProvider>
      <AppContextProvider>
        <ThemeProvider>
          <PlaylistProvider>
            <RadiosProvider>
              <PlayerContextProvider>
                <RouterProvider router={router} />
                <ToastContainer theme="colored" />
              </PlayerContextProvider>
            </RadiosProvider>
          </PlaylistProvider>
        </ThemeProvider>
      </AppContextProvider>
    </LangProvider>
  )
}

export default App
