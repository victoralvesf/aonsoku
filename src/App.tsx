import { useContext } from 'react'
import { RouterProvider } from "react-router-dom"
import AppContext from './app/contexts/app-context'
import ServerConfig from './app/components/server-config'
import { router } from './routes/router'

function App() {
  const {
    isServerConfigured
  } = useContext(AppContext)

  if (!isServerConfigured) {
    return (
      <ServerConfig />
    )
  }

  return (
    <RouterProvider router={router} />
  )
}

export default App;
