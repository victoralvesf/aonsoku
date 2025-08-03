import { LoaderFunctionArgs } from 'react-router-dom'
import { handleDiscographyRedirection } from './utils/handleDiscographyRedirection'
import { handleGenreFilterRedirection } from './utils/handleGenreFilterRedirection'
import { handleMainFilterRedirection } from './utils/handleMainFilterRedirection'
import { handleYearFilterRedirection } from './utils/handleYearFilterRedirection'

export function albumsLoader({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url)

  let redirectResponse: Response | null = null

  redirectResponse = handleDiscographyRedirection(searchParams)
  if (redirectResponse) return redirectResponse

  redirectResponse = handleYearFilterRedirection(searchParams)
  if (redirectResponse) return redirectResponse

  redirectResponse = handleGenreFilterRedirection(searchParams)
  if (redirectResponse) return redirectResponse

  redirectResponse = handleMainFilterRedirection(searchParams)
  if (redirectResponse) return redirectResponse

  return true
}
