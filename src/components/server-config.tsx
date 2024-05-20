import { FormEvent, useContext } from "react"
import AppContext from "../contexts/app-context"

export default function ServerConfig() {
  const {
    setServerUrl,
    setServerUsername,
    setServerPassword,
    handleSaveServerConfig
  } = useContext(AppContext)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await handleSaveServerConfig()
  }

  return (
    <div>
      <h1>Server configuration</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="url">URL</label>
        <input
          type="text"
          id="url"
          autoCorrect="off"
          autoCapitalize="none"
          onChange={(e) => setServerUrl(e.currentTarget.value)}
        />

        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          autoCorrect="off"
          autoCapitalize="none"
          onChange={(e) => setServerUsername(e.currentTarget.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setServerPassword(e.currentTarget.value)}
        />

        <br />

        <button type="submit">Login</button>
      </form>
    </div>
  )
}