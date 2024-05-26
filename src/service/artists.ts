import { httpClient } from "@/api/httpClient";
import { ArtistResponse } from "@/types/responses/artist";

async function getOne(id: string) {
  const response = await httpClient<ArtistResponse>('/getArtist', {
    method: 'GET',
    query: {
      id,
    }
  })

  return response?.artist
}

export const artists = {
  getOne
}
