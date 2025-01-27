import { invoke } from '@tauri-apps/api/core'
import { ISong } from '@/types/responses/song'
import { isTauri } from '@/utils/tauriTools'

async function send(song: ISong, audio: HTMLAudioElement | null) {
  if (!isTauri() || !audio) {
    return
  }

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
    isPaused: audio.paused
  }

  await invoke('update_player_status', statusData)
}

export const rpc = {
  send,
}
