import { useTranslation } from 'react-i18next'
import { Actions } from '@/app/components/actions'
import {
  usePlayerActions,
  usePlayerContext,
  usePlayerStore,
} from '@/store/player.store'
import { PlaylistWithEntries } from '@/types/responses/playlist'
import { PlaylistOptions } from './options'

interface PlaylistButtonsProps {
  playlist: PlaylistWithEntries
}

export function PlaylistButtons({ playlist }: PlaylistButtonsProps) {
  const { t } = useTranslation()
  const { setSongList, togglePlayPause } = usePlayerActions()
  const { source } = usePlayerContext()
  const isPlaying = usePlayerStore((state) => state.playerState.isPlaying)
  const isShuffleActive = usePlayerStore(
    (state) => state.playerState.isShuffleActive,
  )

  const buttonsTooltips = {
    play: t('playlist.buttons.play', { name: playlist.name }),
    shuffle: t('playlist.buttons.shuffle', { name: playlist.name }),
    options: t('playlist.buttons.options', { name: playlist.name }),
    pause: t('playlist.buttons.pause', { name: playlist.name }),
  }

  const isPlaylistActive =
    source?.type === 'playlist' && source.id === playlist.id
  const isPlaylistPlaying = isPlaylistActive && isPlaying

  return (
    <Actions.Container>
      {isPlaylistPlaying && (
        <Actions.Button
          tooltip={buttonsTooltips.pause}
          buttonStyle="primary"
          onClick={togglePlayPause}
          disabled={!playlist.entry}
        >
          <Actions.PauseIcon />
        </Actions.Button>
      )}
      {!isPlaylistPlaying && (
        <Actions.Button
          tooltip={buttonsTooltips.play}
          buttonStyle="primary"
          onClick={() =>
            setSongList(playlist.entry, 0, false, {
              id: playlist.id,
              name: playlist.name,
              type: 'playlist',
            })
          }
          disabled={!playlist.entry}
        >
          <Actions.PlayIcon />
        </Actions.Button>
      )}

      <Actions.Button
        tooltip={buttonsTooltips.shuffle}
        onClick={() =>
          setSongList(playlist.entry, 0, true, {
            id: playlist.id,
            name: playlist.name,
            type: 'playlist',
          })
        }
        disabled={!playlist.entry}
        isActive={isPlaylistPlaying && isShuffleActive}
      >
        <Actions.ShuffleIcon />
      </Actions.Button>

      <Actions.Dropdown
        tooltip={buttonsTooltips.options}
        options={
          <PlaylistOptions
            playlist={playlist}
            disablePlayNext={!playlist.entry}
            disableAddLast={!playlist.entry}
            disableDownload={!playlist.entry}
          />
        }
      />
    </Actions.Container>
  )
}
