import { useContext } from 'react'
import { RouterProvider } from "react-router-dom"
import AppContext from './app/contexts/app-context'
import { ServerConfig } from './app/components/server-config'
import { router } from './routes/router'

function App() {
  const {
    isServerConfigured
  } = useContext(AppContext)

  if (!isServerConfigured) {
    return (
      <div className="flex w-screen h-screen justify-center items-center">
        <ServerConfig />
      </div>
    )
  }

  return (
    <RouterProvider router={router} />
  )
}

export default App;
