import { RouterProvider } from "react-router-dom"
import { ToastContainer } from "react-toastify";
import { router } from '@/routes/router'
import { PlayerContextProvider } from "@/app/contexts/player-context"
import { AppContextProvider } from "@/app/contexts/app-context";
import { ThemeProvider } from "@/app/contexts/theme-context";

function App() {
  return (
    <AppContextProvider>
      <ThemeProvider>
        <PlayerContextProvider>
          <RouterProvider router={router} />
          <ToastContainer theme="colored" />
        </PlayerContextProvider>
      </ThemeProvider>
    </AppContextProvider>
  )
}

export default App;
