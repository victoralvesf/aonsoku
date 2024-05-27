import React from "react"
import ReactDOM from "react-dom/client"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import "@/index.css"

import App from "@/App"
import { AppContextProvider } from "@/app/contexts/app-context"
import { ThemeProvider } from "@/app/contexts/theme-context"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppContextProvider>
      <ThemeProvider>
        <App />
        <ToastContainer theme="colored" />
      </ThemeProvider>
    </AppContextProvider>
  </React.StrictMode>,
);
