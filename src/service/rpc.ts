import { invoke } from '@tauri-apps/api/core'
import { IPlayerContext } from '@/types/playerContext'
import { isTauri } from '@/utils/tauriTools'

async function send(
  playerStore: IPlayerContext,
  audio: HTMLAudioElement | null,
) {
  if (!isTauri() || !audio) {
    return
  }

  const song = playerStore.songlist.currentSong

  const statusData = {
    trackName: song.title,
    albumName: song.album,
    artist: song.artist,
    startTime: Math.floor(Date.now() - (audio!.currentTime || 0) * 1000),
    endTime: Math.floor(
      Date.now() -
        (audio!.currentTime || 0) * 1000 +
        (audio!.duration || 0) * 1000,
    ),
    isPaused: !playerStore.playerState.isPlaying,
  }

  await invoke('update_player_status', statusData)
}

export const rpc = {
  send,
}
