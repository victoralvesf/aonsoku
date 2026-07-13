import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Actions } from '@/app/components/actions'
import { useSongList } from '@/app/hooks/use-song-list'
import { subsonic } from '@/service/subsonic'
import { useAppPages, useAppStore } from '@/store/app.store'
import {
  useIsArtistPlaying,
  usePlayerActions,
  usePlayerStore,
} from '@/store/player.store'
import { IArtist } from '@/types/responses/artist'
import { queryKeys } from '@/utils/queryKeys'
import { ArtistOptions } from './options'

interface ArtistButtonsProps {
  artist: IArtist
  showInfoButton: boolean
  isArtistEmpty: boolean
}

export function ArtistButtons({
  artist,
  showInfoButton,
  isArtistEmpty,
}: ArtistButtonsProps) {
  const { t } = useTranslation()
  const { setSongList, togglePlayPause, toggleShuffle } = usePlayerActions()
  const { showInfoPanel, toggleShowInfoPanel } = useAppPages()
  const { getArtistAllSongs } = useSongList()
  const { isArtistActive, isArtistPlaying } = useIsArtistPlaying(artist.id)
  const isShuffleActive = usePlayerStore(
    (state) => state.playerState.isShuffleActive,
  )
  const hideFavoritesSection = useAppStore().pages.hideFavoritesSection
  const isArtistStarred = artist.starred !== undefined

  const queryClient = useQueryClient()

  const starMutation = useMutation({
    mutationFn: subsonic.star.handleStarItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.artist.single, artist.id],
      })
    },
  })

  function handleLikeButton() {
    if (!artist) return
    starMutation.mutate({
      id: artist.id,
      starred: isArtistStarred,
    })
  }

  async function playArtistRadio(shuffle = false) {
    const songList = await getArtistAllSongs(artist?.name || '')

    if (songList) {
      setSongList(songList, 0, shuffle, {
        id: artist.id,
        name: artist.name,
        type: 'artist',
      })
    }
  }

  function handlePlayButton() {
    if (isArtistActive) {
      togglePlayPause()
    } else {
      playArtistRadio()
    }
  }

  function handleShuffleButton() {
    if (isArtistActive) {
      toggleShuffle()
    } else {
      playArtistRadio(true)
    }
  }

  const buttonsTooltips = {
    play: isArtistPlaying
      ? t('playlist.buttons.pause', { name: artist.name })
      : t('playlist.buttons.play', { name: artist.name }),
    shuffle: t('playlist.buttons.shuffle', { name: artist.name }),
    options: t('playlist.buttons.options', { name: artist.name }),
    like: isArtistStarred
      ? t('album.buttons.dislike', { name: artist.name })
      : t('album.buttons.like', { name: artist.name }),
    info: showInfoPanel ? t('generic.hideDetails') : t('generic.showDetails'),
  }

  if (isArtistEmpty) {
    return <div className="h-8 w-full" />
  }

  return (
    <Actions.Container>
      <Actions.Button
        tooltip={buttonsTooltips.play}
        buttonStyle="primary"
        onClick={handlePlayButton}
      >
        {isArtistPlaying ? <Actions.PauseIcon /> : <Actions.PlayIcon />}
      </Actions.Button>

      <Actions.Button
        tooltip={buttonsTooltips.shuffle}
        onClick={handleShuffleButton}
        isActive={isArtistActive && isShuffleActive}
      >
        <Actions.ShuffleIcon />
      </Actions.Button>

      {!hideFavoritesSection && (
        <>
          <Actions.Button
            tooltip={buttonsTooltips.like}
            onClick={handleLikeButton}
          >
            <Actions.LikeIcon isStarred={isArtistStarred} />
          </Actions.Button>
        </>
      )}
      {showInfoButton && (
        <Actions.Button
          tooltip={buttonsTooltips.info}
          onClick={toggleShowInfoPanel}
        >
          <Actions.InfoIcon />
        </Actions.Button>
      )}

      <Actions.Dropdown
        tooltip={buttonsTooltips.options}
        options={<ArtistOptions artist={artist} />}
      />
    </Actions.Container>
  )
}
