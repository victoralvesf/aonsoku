import { useContext } from 'react'
import AppContext from './app/contexts/app-context'
import ServerConfig from './app/components/server-config'
import RecentlyAddedAlbums from './app/pages/recently-added-albums'
import BaseLayout from './app/layout/base'

function App() {
  const {
    isServerConfigured,
    // handleRemoveServerConfig
  } = useContext(AppContext)

  // async function handleRemoveConfig(e: MouseEvent<HTMLButtonElement>) {
  //   e.preventDefault()
  //   await handleRemoveServerConfig()
  // }

  if (!isServerConfigured) {
    return (
      <ServerConfig />
    )
  }

  return (
    <BaseLayout />
  )
}

export default App;
