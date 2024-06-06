import { RouterProvider } from "react-router-dom"
import { ToastContainer } from "react-toastify";
import { router } from '@/routes/router'
import { PlayerContextProvider } from "@/app/contexts/player-context"
import { AppContextProvider } from "@/app/contexts/app-context";
import { ThemeProvider } from "@/app/contexts/theme-context";
import { LangProvider } from "@/app/contexts/lang-context";
import { PlaylistProvider } from "@/app/contexts/playlists-context";
import { RadiosProvider } from "@/app/contexts/radios-context";

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

export default App;
