import { z } from 'zod'

import { httpClient } from '@/api/httpClient'
import { SubsonicResponse } from '@/types/responses/subsonicResponse'

// ratings are since 1.6.0 (https://www.subsonic.org/pages/api.jsp#setRating)
// between 1-5, or 0 to remove. 

const ratingSchema = z.object({
  id: z.string(),
  rating: z.number().min(0).max(5),
})

async function rateItem({ id, rating }: z.infer<typeof ratingSchema>) {
  await httpClient<SubsonicResponse>('/setRating', {
    method: 'GET',
    query: {
      id,
      rating,
    },
  })
}

export const rating = {
  rateItem
}
