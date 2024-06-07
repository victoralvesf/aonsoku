import { createContext, useState, useContext, ReactNode, useEffect, useRef, useCallback, useMemo } from 'react'
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

  const sendScrobble = useCallback(async (songId: string) => {
    await subsonic.scrobble.send(songId)
  }, [])

  const playSong = useCallback((song: ISong) => {
    if (checkActiveSong(song.id) && !isPlaying) {
      setIsPlaying(true)
      return
    }
    setCurrentSongList([song])
    setCurrentSongIndex(0)
    setIsShuffleActive(false)
    setIsPlaying(true)
  }, [isPlaying])

  const setSongList = useCallback((songlist: ISong[], index: number, shuffle = false) => {
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
  }, [])

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prevState => !prevState)
  }, [])

  const toggleLoop = useCallback(() => {
    setIsLoopActive(prevState => !prevState)
  }, [])

  const toggleShuffle = useCallback(() => {
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
    setIsShuffleActive(prevState => !prevState)
  }, [isShuffleActive, currentSongIndex, currentSongList, originalSongList])

  const clearPlayerState = useCallback(() => {
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
  }, [])

  const hasNextSong = useMemo(() => {
    return isShuffleActive || currentSongIndex + 1 < currentSongList.length
  }, [isShuffleActive, currentSongIndex, currentSongList.length])

  const hasPrevSong = useMemo(() => {
    return currentSongIndex > 0
  }, [currentSongIndex])

  const isPlayingOneSong = useMemo(() => {
    return currentSongList.length === 1
  }, [currentSongList.length])

  const playNextSong = useCallback(() => {
    if (hasNextSong) {
      setCurrentSongIndex(prevIndex => prevIndex + 1)
    }
  }, [hasNextSong])

  const playPrevSong = useCallback(() => {
    if (hasPrevSong) {
      setCurrentSongIndex(prevIndex => prevIndex - 1)
    }
  }, [hasPrevSong])

  useEffect(() => {
    manageMediaSession.setHandlers({
      playPrev: playPrevSong,
      playNext: playNextSong
    })
  }, [playPrevSong, playNextSong])

  const setPlayingState = useCallback((state: boolean) => {
    setIsPlaying(state)
  }, [])

  const getCurrentSong = useCallback(() => {
    return currentSongList[currentSongIndex]
  }, [currentSongList, currentSongIndex])

  const checkActiveSong = useCallback((id: string) => {
    return id === getCurrentSong()?.id
  }, [getCurrentSong])

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
    setCurrentDuration,
    getCurrentSong
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
