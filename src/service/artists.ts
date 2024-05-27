import { httpClient } from "@/api/httpClient";
import { ArtistInfoResponse, ArtistResponse } from "@/types/responses/artist";

async function getOne(id: string) {
  const response = await httpClient<ArtistResponse>('/getArtist', {
    method: 'GET',
    query: {
      id,
    }
  })

  return response?.artist
}

async function getInfo(id: string) {
  const response = await httpClient<ArtistInfoResponse>('/getArtistInfo', {
    method: 'GET',
    query: {
      id,
    }
  })

  return response?.artistInfo
}

export const artists = {
  getOne,
  getInfo
}
