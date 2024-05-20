import React from "react"
import ReactDOM from "react-dom/client"
import { ToastContainer } from "react-toastify"

import { AppContextProvider } from "@/app/contexts/app-context"
import App from "@/App"

import "@/index.css"
import 'react-toastify/dist/ReactToastify.css'
import { ThemeProvider } from "./app/contexts/theme-context"

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
