import { createContext, useState, useContext, ReactNode, useEffect, useRef } from 'react'
import { IPlayerContext } from '@/types/playerContext'
import { ISong } from '@/types/responses/song'
import { shuffleSongList } from '@/utils/shuffleArray'
import { subsonic } from '@/service/subsonic'
import { manageMediaSession } from '@/utils/setMediaSession'

const PlayerContext = createContext({} as IPlayerContext)

export function PlayerContextProvider({ children }: { children: ReactNode }) {
  const [originalSongList, setOriginalSongList] = useState<ISong[]>([])
  const [shuffledSongList, setShuffledSongList] = useState<ISong[]>([])
  const [currentSongList, setCurrentSongList] = useState<ISong[]>([])
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [originalSongIndex, setOriginalSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoopActive, setIsLoopActive] = useState(false)
  const [isShuffleActive, setIsShuffleActive] = useState(false)
  const [isSongStarred, setIsSongStarred] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentDuration, setCurrentDuration] = useState(0)
  const isScrobbleSentRef = useRef(false)

  useEffect(() => {
    if (currentSongList.length > 0) {
      isScrobbleSentRef.current = false

      const currentSong = getCurrentSong()
      const starredStatus = currentSong.starred ? true : false
      setIsSongStarred(starredStatus)

      manageMediaSession.setMediaSession(currentSong)
    }
  }, [currentSongList, currentSongIndex])

  useEffect(() => {
    manageMediaSession.setPlaybackState(isPlaying)
  }, [isPlaying])

  useEffect(() => {
    const progressPercentage = (progress / currentDuration) * 100

    if (progressPercentage >= 50 && !isScrobbleSentRef.current) {
      sendScrobble(getCurrentSong().id)
      isScrobbleSentRef.current = true
    }
  }, [progress, currentDuration])

  async function sendScrobble(songId: string) {
    await subsonic.scrobble.send(songId)
  }

  function playSong(song: ISong) {
    if (checkActiveSong(song.id) && !isPlaying) {
      setIsPlaying(true)
      return
    }
    setCurrentSongList([song])
    setCurrentSongIndex(0)
    setIsShuffleActive(false)
    setIsPlaying(true)
  }

  function setSongList(songlist: ISong[], index: number, shuffle = false) {
    setOriginalSongList(songlist)
    setOriginalSongIndex(index)


    if (shuffle) {
      const shuffledList = shuffleSongList(songlist, index, true)
      setShuffledSongList(shuffledList)

      setCurrentSongList(shuffledList)
      setCurrentSongIndex(0)
      setIsShuffleActive(true)
    } else {
      setCurrentSongList(songlist)
      setCurrentSongIndex(index)
      if (isShuffleActive) setIsShuffleActive(false)
    }

    setIsPlaying(true)
  }

  function togglePlayPause() {
    setIsPlaying(!isPlaying)
  }

  function toggleLoop() {
    setIsLoopActive(!isLoopActive)
  }

  function toggleShuffle() {
    if (isShuffleActive) {
      const currentSongId = currentSongList[currentSongIndex].id
      const index = originalSongList.findIndex(song => song.id === currentSongId)

      setCurrentSongList(originalSongList)
      setCurrentSongIndex(index)
    } else {
      const songListToShuffle = currentSongList.slice(currentSongIndex)
      const shuffledList = shuffleSongList(songListToShuffle, 0)

      setShuffledSongList(shuffledList)
      setCurrentSongList(shuffledList)
      setCurrentSongIndex(0)
    }
    setIsShuffleActive(!isShuffleActive)
  }

  function clearPlayerState() {
    setOriginalSongList([])
    setShuffledSongList([])
    setCurrentSongList([])
    setOriginalSongIndex(0)
    setCurrentSongIndex(0)
    setIsPlaying(false)
    setIsLoopActive(false)
    setIsShuffleActive(false)
    setProgress(0)
    setCurrentDuration(0)
    manageMediaSession.setPlaybackState(null)
  }

  const hasNextSong = isShuffleActive || currentSongIndex + 1 < currentSongList.length
  const hasPrevSong = currentSongIndex > 0
  const isPlayingOneSong = currentSongList.length === 1

  function playNextSong() {
    if (hasNextSong) {
      setCurrentSongIndex(currentSongIndex + 1)
    }
  }

  function playPrevSong() {
    if (hasPrevSong) {
      setCurrentSongIndex(currentSongIndex - 1)
    }
  }

  manageMediaSession.setHandlers({
    playPrev: playPrevSong,
    playNext: playNextSong
  })

  function setPlayingState(state: boolean) {
    setIsPlaying(state)
  }

  function getCurrentSong() {
    return currentSongList[currentSongIndex]
  }

  function checkActiveSong(id: string) {
    return id === getCurrentSong()?.id
  }

  const value: IPlayerContext = {
    shuffledSongList,
    currentSongList,
    currentSongIndex,
    originalSongIndex,
    isPlaying,
    isLoopActive,
    isShuffleActive,
    isPlayingOneSong,
    isSongStarred,
    setIsSongStarred,
    playSong,
    setPlayingState,
    setSongList,
    togglePlayPause,
    toggleLoop,
    toggleShuffle,
    checkActiveSong,
    playNextSong,
    playPrevSong,
    clearPlayerState,
    hasNextSong,
    hasPrevSong,
    progress,
    setProgress,
    currentDuration,
    setCurrentDuration
  }

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  return useContext(PlayerContext)
}
