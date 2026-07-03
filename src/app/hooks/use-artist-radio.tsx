import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useSongList } from '@/app/hooks/use-song-list'
import { subsonic } from '@/service/subsonic'
import { usePlayerActions } from '@/store/player.store'
import { IArtist } from '@/types/responses/artist'
import { ISong } from '@/types/responses/song'
import { getServerExtensions } from '@/utils/servers'

export function useArtistRadio(artist: IArtist) {
  const { t } = useTranslation()
  const { getArtistAllSongs } = useSongList()
  const { setSongList } = usePlayerActions()
  const { sonicSimilarityEnabled } = getServerExtensions()

  async function getRadioSeed(): Promise<ISong | undefined> {
    try {
      const topSongs = await subsonic.songs.getTopSongs(artist.name)
      if (topSongs && topSongs.length > 0) return topSongs[0]
    } catch {
      // The server may not provide top songs for this artist; fall back below.
    }

    const artistSongs = await getArtistAllSongs(artist.name)
    return artistSongs?.[0]
  }

  async function startRadio() {
    const seed = await getRadioSeed()
    if (!seed) {
      toast.error(t('artist.radio.empty'))
      return
    }

    const similarTracks = await subsonic.songs.getSonicSimilarTracks(seed.id)

    if (similarTracks.length === 0) {
      toast.error(t('artist.radio.empty'))
      return
    }

    // Start from the seed track and append the similar ones, removing any
    // duplicates (the endpoint may return the seed itself with similarity 1.0).
    const radioList = [seed, ...similarTracks].filter(
      (song, index, list) => list.findIndex((s) => s.id === song.id) === index,
    )

    setSongList(radioList, 0, false, {
      id: artist.id,
      name: artist.name,
      type: 'artist',
    })
  }

  return {
    sonicSimilarityEnabled,
    startRadio,
  }
}
