import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { OptionsButtons } from '@/app/components/options/buttons'
import { DownloadOptionHandler } from '@/app/components/options/download-handler'
import { DropdownMenuGroup } from '@/app/components/ui/dropdown-menu'
import { useOptions } from '@/app/hooks/use-options'
import { useSongList } from '@/app/hooks/use-song-list'
import { subsonic } from '@/service/subsonic'
import { usePlayerActions } from '@/store/player.store'
import { IArtist } from '@/types/responses/artist'
import { ISong } from '@/types/responses/song'
import { getServerExtensions } from '@/utils/servers'

interface ArtistOptionsProps {
  artist: IArtist
}

export function ArtistOptions({ artist }: ArtistOptionsProps) {
  const { t } = useTranslation()
  const { getArtistAllSongs } = useSongList()
  const { playLast, playNext, startDownload } = useOptions()
  const { setSongList } = usePlayerActions()
  const { sonicSimilarityEnabled } = getServerExtensions()

  async function getSongsToQueue(callback: (songs: ISong[]) => void) {
    const songs = await getArtistAllSongs(artist.name)
    if (!songs) return

    callback(songs)
  }

  async function handlePlayNext() {
    await getSongsToQueue(playNext)
  }

  async function handlePlayLast() {
    await getSongsToQueue(playLast)
  }

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

  async function handleStartRadio() {
    const seed = await getRadioSeed()
    if (!seed) {
      toast.error(t('options.startRadioEmpty'))
      return
    }

    const similarTracks = await subsonic.songs.getSonicSimilarTracks(seed.id)

    if (similarTracks.length === 0) {
      toast.error(t('options.startRadioEmpty'))
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

  function handleDownload() {
    startDownload(artist.id)
  }

  return (
    <>
      <DropdownMenuGroup>
        <OptionsButtons.PlayNext onClick={handlePlayNext} />
        <OptionsButtons.PlayLast onClick={handlePlayLast} />
        {sonicSimilarityEnabled && (
          <OptionsButtons.StartRadio onClick={handleStartRadio} />
        )}
        <DownloadOptionHandler group={false}>
          <OptionsButtons.Download onClick={handleDownload} />
        </DownloadOptionHandler>
      </DropdownMenuGroup>
    </>
  )
}
