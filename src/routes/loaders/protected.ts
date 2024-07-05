import { redirect } from 'react-router-dom'
import { ROUTES } from '@/routes/routesList'
import { subsonic } from '@/service/subsonic'
import { useAppStore } from '@/store/app.store'

export async function protectedLoader() {
  const { url } = useAppStore.getState().data
  if (!url || url === '') return redirect(ROUTES.SERVER_CONFIG)

  const isServerUp = await subsonic.ping.pingView()
  if (!isServerUp) return redirect(ROUTES.SERVER_CONFIG)

  return null
}
