import { httpClient } from '@/api/httpClient'
import { GenresResponse } from '@/types/responses/genre'

async function get() {
  const response = await httpClient<GenresResponse>('/getGenres', {
    method: 'GET',
  })

  return response?.data.genres.genre
}

export const genres = {
  get,
}
