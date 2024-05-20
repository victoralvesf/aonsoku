import React from "react"
import ReactDOM from "react-dom/client"
import { ToastContainer } from "react-toastify"

import { AppContextProvider } from "@/app/contexts/app-context"
import App from "@/App"

import "@/index.css"
import 'react-toastify/dist/ReactToastify.css'

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppContextProvider>
      <App />
      <ToastContainer theme="colored" />
    </AppContextProvider>
  </React.StrictMode>,
);
