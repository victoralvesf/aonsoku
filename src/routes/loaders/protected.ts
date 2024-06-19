import { redirect } from 'react-router-dom'
import { ROUTES } from '@/routes/routesList'
import { subsonic } from '@/service/subsonic'

export async function protectedLoader() {
  const serverUrl = localStorage.getItem('server-url')
  if (!serverUrl) return redirect(ROUTES.SERVER_CONFIG)

  const isServerUp = await subsonic.ping.pingView()
  if (!isServerUp) return redirect(ROUTES.SERVER_CONFIG)

  return null
}
