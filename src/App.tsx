import { RouterProvider } from "react-router-dom"
import { useApp } from './app/contexts/app-context'
import { ServerConfig } from './app/components/server-config'
import { router } from './routes/router'

function App() {
  const {
    isServerConfigured
  } = useApp()

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
