import { LoaderFunctionArgs } from 'react-router-dom'
import { handleDiscographyRedirection } from './utils/handleDiscographyRedirection'

export function albumsLoader({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url)

  let redirectResponse: Response | null = null

  redirectResponse = handleDiscographyRedirection(searchParams)
  if (redirectResponse) return redirectResponse

  return true
}
