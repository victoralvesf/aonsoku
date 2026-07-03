import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useSongList } from '@/app/hooks/use-song-list'
import { subsonic } from '@/service/subsonic'
import { usePlayerActions } from '@/store/player.store'
import { IArtist } from '@/types/responses/artist'
import { ISong } from '@/types/responses/song'
import { checkServerType, getServerExtensions } from '@/utils/servers'

export function useArtistRadio(artist: IArtist) {
  const { t } = useTranslation()
  const { getArtistAllSongs } = useSongList()
  const { setSongList } = usePlayerActions()
  const { sonicSimilarityEnabled } = getServerExtensions()
  const { isNavidrome } = checkServerType()

  // Sonic radio needs the sonicSimilarity extension (e.g. AudioMuse-AI); the
  // classic id3 artist radio (getSimilarSongs2) works on any Navidrome server.
  const isRadioAvailable = Boolean(sonicSimilarityEnabled || isNavidrome)

  function dedupeById(list: ISong[]) {
    return list.filter(
      (song, index, arr) => arr.findIndex((s) => s.id === song.id) === index,
    )
  }

  async function getSonicRadio(): Promise<ISong[]> {
    // getSonicSimilarTracks is seeded by a song, so use the artist's top song
    // (falling back to their first available track).
    let seed: ISong | undefined
    try {
      const topSongs = await subsonic.songs.getTopSongs(artist.name)
      seed = topSongs?.[0]
    } catch {
      seed = undefined
    }
    if (!seed) {
      const artistSongs = await getArtistAllSongs(artist.name)
      seed = artistSongs?.[0]
    }
    if (!seed) return []

    const similarTracks = await subsonic.songs.getSonicSimilarTracks(seed.id)
    if (similarTracks.length === 0) return []

    // The endpoint may return the seed itself (similarity 1.0); de-duplicate.
    return dedupeById([seed, ...similarTracks])
  }

  async function startRadio() {
    let radioList: ISong[] = []

    if (sonicSimilarityEnabled) {
      radioList = await getSonicRadio()
    }

    // Fall back to Navidrome's id3-based similar songs (the classic radio).
    if (radioList.length === 0) {
      radioList = await subsonic.songs.getSimilarSongs2(artist.id)
    }

    if (radioList.length === 0) {
      toast.error(t('artist.radio.empty'))
      return
    }

    setSongList(radioList, 0, false, {
      id: artist.id,
      name: artist.name,
      type: 'artist',
    })
  }

  return {
    isRadioAvailable,
    startRadio,
  }
}
