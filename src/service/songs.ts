import { httpClient } from "@/api/httpClient";
import { RandomSongsResponse } from "@/types/responses/song";

async function getRandomSongs(size = 10) {
  const response = await httpClient<RandomSongsResponse>('/getRandomSongs', {
    method: 'GET',
    query: {
      size: size.toString(),
    }
  })

  return response?.randomSongs.song
}

export const songs = {
  getRandomSongs
}
