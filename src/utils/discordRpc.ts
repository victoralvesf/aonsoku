import { getSimpleCoverArtUrl } from '@/api/httpClient'
import { useAppStore } from '@/store/app.store'
import { usePlayerStore } from '@/store/player.store'
import { ISong } from '@/types/responses/song'
import { isDesktop } from './desktop'

function cleanSearchTerm(str: string): string {
  return str
    .replace(/\(feat\..*?\)/gi, '')
    .replace(/\[.*?\]/gi, '')
    .replace(/\(.*?\) /gi, '')
    .trim()
}

async function fetchPublicArtwork(song: ISong): Promise<string | null> {
  const primaryArtist = song.artists?.[0]?.name || song.artist
  const cleanedTitle = cleanSearchTerm(song.title)
  const cleanedAlbum = cleanSearchTerm(song.album)
  const cleanedArtist = cleanSearchTerm(primaryArtist)

  // Try different search queries in order of specificity
  const queries = [
    `${cleanedArtist} ${cleanedAlbum} ${cleanedTitle}`,
    `${cleanedArtist} ${cleanedTitle}`,
    `${cleanedArtist} ${cleanedAlbum}`,
  ]

  for (const query of queries) {
    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=musicTrack&limit=10`
      )
      const data = await response.json()

      if (data.results && data.results.length > 0) {
        // Score results to find the best match
        const scoredResults = data.results.map((result: any) => {
          let score = 0
          const resultArtist = result.artistName?.toLowerCase() || ''
          const resultAlbum = result.collectionName?.toLowerCase() || ''
          const resultTitle = result.trackName?.toLowerCase() || ''

          if (resultArtist.includes(cleanedArtist.toLowerCase())) score += 3
          if (resultAlbum.includes(cleanedAlbum.toLowerCase())) score += 5
          if (resultTitle.includes(cleanedTitle.toLowerCase())) score += 4
          
          // Bonus for exact matches
          if (resultArtist === cleanedArtist.toLowerCase()) score += 2
          if (resultAlbum === cleanedAlbum.toLowerCase()) score += 3

          return { url: result.artworkUrl100, score }
        })

        const bestMatch = scoredResults.sort((a: any, b: any) => b.score - a.score)[0]

        if (bestMatch && bestMatch.score > 5) {
          return bestMatch.url.replace('100x100bb', '512x512bb')
        }
      }
    } catch (e) {
      console.warn('Discord RPC: Search attempt failed', e)
    }
  }
  return null
}

async function send(song: ISong, currentTime = 0, duration = 0) {
  if (!isDesktop()) return

  const { rpcEnabled } = useAppStore.getState().accounts.discord
  if (!rpcEnabled) return

  const currentTimeInMs = currentTime * 1000
  const durationInMs = duration * 1000

  const artist = song.artists
    ? song.artists.map((artist) => artist.name).join(', ')
    : song.artist

  const startTime = Math.floor(Date.now() - currentTimeInMs)
  const endTime = Math.floor(Date.now() - currentTimeInMs + durationInMs)

  // Try to get a public URL for Discord to proxy/cache
  const publicImageUrl = await fetchPublicArtwork(song)
  const imageUrl = publicImageUrl || getSimpleCoverArtUrl(song.coverArt, 'song', '512')

  window.api.setDiscordRpcActivity({
    trackName: song.title,
    albumName: song.album,
    artist,
    startTime,
    endTime,
    duration,
    imageUrl,
  })
}

function clear() {
  if (!isDesktop()) return

  window.api.clearDiscordRpcActivity()
}

function sendCurrentSong() {
  if (!isDesktop()) return

  const { playerState, songlist, actions } = usePlayerStore.getState()

  const { mediaType } = playerState
  if (mediaType !== 'song') return

  const { currentSong } = songlist
  const currentTime = actions.getCurrentProgress()
  const { isPlaying, currentDuration } = playerState

  // Clear activity if paused or there is no song
  if (!currentSong || !isPlaying) discordRpc.clear()

  if (currentSong && isPlaying) {
    discordRpc.send(currentSong, currentTime, currentDuration)
  }
}

export const discordRpc = {
  send,
  clear,
  sendCurrentSong,
}
