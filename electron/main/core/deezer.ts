import https from 'https'

interface DeezerArtist {
  id: number
  name: string
  link: string
  picture: string
  picture_small: string
  picture_medium: string
  picture_big: string
  picture_xl: string
  tracklist: string
  type: string
}

interface DeezerAlbum {
  id: number
  title: string
  cover: string
  cover_small: string
  cover_medium: string
  cover_big: string
  cover_xl: string
  md5_image: string
  tracklist: string
  type: string
}

interface DeezerTrack {
  id: number
  readable: boolean
  title: string
  title_short: string
  title_version: string
  link: string
  duration: number
  rank: number
  explicit_lyrics: boolean
  explicit_content_lyrics: number
  explicit_content_cover: number
  preview: string
  md5_image: string
  artist: DeezerArtist
  album: DeezerAlbum
  type: string
}

interface DeezerSearchResponse {
  data: DeezerTrack[]
  total: number
}

type DeezerSearchPayload = {
  artist: string
  track: string
  album: string
  duration: number
}

const DEEZER_API_BASE_URL = 'https://api.deezer.com'

async function search(
  payload: DeezerSearchPayload,
): Promise<DeezerTrack | undefined> {
  const { artist, track, album, duration } = payload

  const url = new URL('/search', DEEZER_API_BASE_URL)
  const query = [
    `artist:"${artist}"`,
    `track:"${track}"`,
    `album:"${album}"`,
    `dur_min:${duration - 10}`,
    `dur_max:${duration + 10}`,
  ]

  url.searchParams.append('q', query.join(' '))
  url.searchParams.append('output', 'json')

  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let dataChunks = ''

        res.on('data', (chunk) => {
          dataChunks += chunk
        })

        res.on('end', () => {
          try {
            const response: DeezerSearchResponse | undefined =
              JSON.parse(dataChunks)

            if (!response || !response.data || response.data.length === 0) {
              resolve(undefined)
              return
            }

            resolve(response.data[0])
          } catch {
            resolve(undefined)
          }
        })
      })
      .on('error', (error) => {
        console.log('Error Searching on Deezer', error)
        reject(error)
      })
  })
}

export const deezerService = {
  search,
}
