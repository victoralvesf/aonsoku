import { useContext } from 'react'
import AppContext from './contexts/app-context'
import ServerConfig from './components/server-config'
import RecentlyAddedAlbums from './pages/recently-added-albums'

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
    <RecentlyAddedAlbums />
  )
}

export default App;
