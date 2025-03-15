import { produce } from 'immer'
import clamp from 'lodash/clamp'
import merge from 'lodash/merge'
import omit from 'lodash/omit'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'
import { subsonic } from '@/service/subsonic'
import { IPlayerContext, LoopState } from '@/types/playerContext'
import { ISong } from '@/types/responses/song'
import { areSongListsEqual } from '@/utils/compareSongLists'
import { addNextSongList, shuffleSongList } from '@/utils/songListFunctions'

export const usePlayerStore = createWithEqualityFn<IPlayerContext>()(
  subscribeWithSelector(
    persist(
      devtools(
        immer((set, get) => ({
          songlist: {
            shuffledList: [],
            originalList: [],
            originalSongIndex: 0,
            currentSong: {} as ISong,
            currentList: [],
            currentSongIndex: 0,
            radioList: [],
          },
          playerState: {
            isPlaying: false,
            loopState: LoopState.Off,
            isShuffleActive: false,
            isSongStarred: false,
            volume: 100,
            currentDuration: 0,
            mediaType: 'song',
            audioPlayerRef: null,
            queueDrawerState: false,
          },
          playerProgress: {
            progress: 0,
          },
          settings: {
            privacy: {
              lrcLibEnabled: true,
              setLrcLibEnabled(value) {
                set((state) => {
                  state.settings.privacy.lrcLibEnabled = value
                })
              },
            },
            volume: {
              min: 0,
              max: 100,
              step: 1,
              wheelStep: 5,
            },
            fullscreen: {
              autoFullscreenEnabled: false,
              setAutoFullscreenEnabled: (value) => {
                set((state) => {
                  state.settings.fullscreen.autoFullscreenEnabled = value
                })
              },
            },
            lyrics: {
              preferSyncedLyrics: false,
              setPreferSyncedLyrics: (value) => {
                set((state) => {
                  state.settings.lyrics.preferSyncedLyrics = value
                })
              },
            },
            replayGain: {
              values: {
                enabled: false,
                type: 'track',
                preAmp: 0,
                error: false,
                defaultGain: -6,
              },
              actions: {
                setReplayGainEnabled: (value) => {
                  set((state) => {
                    state.settings.replayGain.values.enabled = value
                  })
                },
                setReplayGainType: (value) => {
                  set((state) => {
                    state.settings.replayGain.values.type = value
                  })
                },
                setReplayGainPreAmp: (value) => {
                  set((state) => {
                    state.settings.replayGain.values.preAmp = value
                  })
                },
                setReplayGainError: (value) => {
                  set((state) => {
                    state.settings.replayGain.values.error = value
                  })
                },
                setReplayGainDefaultGain: (value) => {
                  set((state) => {
                    state.settings.replayGain.values.defaultGain = value
                  })
                },
              },
            },
          },
          actions: {
            setSongList: (songlist, index, shuffle = false) => {
              const { currentList, currentSongIndex } = get().songlist

              const listsAreEqual = areSongListsEqual(currentList, songlist)
              const songHasChanged = currentSongIndex !== index

              if (!listsAreEqual || (listsAreEqual && songHasChanged)) {
                get().actions.resetProgress()
              }

              if (listsAreEqual && songHasChanged && !shuffle) {
                set((state) => {
                  state.playerState.isPlaying = true
                  state.songlist.currentSongIndex = index
                })
                return
              }

              set((state) => {
                state.songlist.originalList = songlist
                state.songlist.originalSongIndex = index
                state.playerState.mediaType = 'song'
                state.songlist.radioList = []
              })

              if (shuffle) {
                const shuffledList = shuffleSongList(songlist, index, true)

                set((state) => {
                  state.songlist.shuffledList = shuffledList
                  state.songlist.currentList = shuffledList
                  state.songlist.currentSongIndex = 0
                  state.playerState.isShuffleActive = true
                  state.playerState.isPlaying = true
                })
              } else {
                set((state) => {
                  state.songlist.currentList = songlist
                  state.songlist.currentSongIndex = index
                  state.playerState.isShuffleActive = false
                  state.playerState.isPlaying = true
                })
              }
            },
            setCurrentSong: () => {
              const { currentList, currentSongIndex } = get().songlist

              if (currentList.length > 0) {
                set((state) => {
                  state.songlist.currentSong = currentList[currentSongIndex]
                })
              }
            },
            playSong: (song) => {
              const { isPlaying } = get().playerState
              const songIsAlreadyPlaying = get().actions.checkActiveSong(
                song.id,
              )
              if (songIsAlreadyPlaying && !isPlaying) {
                set((state) => {
                  state.playerState.isPlaying = true
                })
              } else {
                get().actions.resetProgress()
                set((state) => {
                  state.playerState.mediaType = 'song'
                  state.songlist.currentList = [song]
                  state.songlist.currentSongIndex = 0
                  state.playerState.isShuffleActive = false
                  state.playerState.isPlaying = true
                })
              }
            },
            setNextOnQueue: (list) => {
              const {
                currentList,
                currentSongIndex,
                currentSong,
                originalList,
              } = get().songlist

              const currentListIds = new Set(currentList.map((song) => song.id))
              const uniqueList = list.filter(
                (song) => !currentListIds.has(song.id),
              )

              const newCurrentList = addNextSongList(
                currentSongIndex,
                currentList,
                uniqueList,
              )

              const indexOnOriginalList = originalList.findIndex(
                (song) => song.id === currentSong.id,
              )
              const newOriginalList = addNextSongList(
                indexOnOriginalList,
                originalList,
                uniqueList,
              )

              set((state) => {
                state.songlist.currentList = newCurrentList
                state.songlist.originalList = newOriginalList
              })

              const { isPlaying } = get().playerState

              if (!isPlaying) {
                get().actions.setPlayingState(true)
              }
            },
            setLastOnQueue: (list) => {
              const { currentList, originalList } = get().songlist

              const currentListIds = new Set(currentList.map((song) => song.id))
              const uniqueList = list.filter(
                (song) => !currentListIds.has(song.id),
              )

              const newCurrentList = [...currentList, ...uniqueList]
              const newOriginalList = [...originalList, ...uniqueList]

              set((state) => {
                state.songlist.currentList = newCurrentList
                state.songlist.originalList = newOriginalList
              })

              const { isPlaying } = get().playerState

              if (!isPlaying) {
                get().actions.setPlayingState(true)
              }
            },
            setPlayRadio: (list, index) => {
              const { mediaType } = get().playerState
              const { radioList, currentSongIndex } = get().songlist

              if (
                mediaType === 'radio' &&
                radioList.length > 0 &&
                list[index].id === radioList[currentSongIndex].id
              ) {
                set((state) => {
                  state.playerState.isPlaying = true
                })
                return
              }

              get().actions.clearPlayerState()
              set((state) => {
                state.playerState.mediaType = 'radio'
                state.songlist.radioList = list
                state.songlist.currentSongIndex = index
                state.playerState.isPlaying = true
              })
            },
            setPlayingState: (status) => {
              set((state) => {
                state.playerState.isPlaying = status
              })
            },
            togglePlayPause: () => {
              set((state) => {
                state.playerState.isPlaying = !state.playerState.isPlaying
              })
            },
            toggleLoop: () => {
              const { loopState } = get().playerState

              // Cycles to the next state
              const newState =
                (loopState + 1) % (Object.keys(LoopState).length / 2)

              set((state) => {
                state.playerState.loopState = newState
              })
            },
            toggleShuffle: () => {
              const { isShuffleActive } = get().playerState
              const { currentList, currentSongIndex } = get().songlist

              const listLength = currentList.length
              const isPlayingOneOrLess = listLength <= 1
              const isPlayingLastSong = currentSongIndex === listLength - 1

              if (isPlayingOneOrLess || isPlayingLastSong) return

              if (isShuffleActive) {
                const currentSongId = get().songlist.currentSong.id
                const index = get().songlist.originalList.findIndex(
                  (song) => song.id === currentSongId,
                )

                set((state) => {
                  state.songlist.currentList = state.songlist.originalList
                  state.songlist.currentSongIndex = index
                  state.playerState.isShuffleActive = false
                })
              } else {
                const { currentList, currentSongIndex } = get().songlist
                const songListToShuffle = currentList.slice(currentSongIndex)
                const shuffledList = shuffleSongList(songListToShuffle, 0)

                set((state) => {
                  state.songlist.shuffledList = shuffledList
                  state.songlist.currentList = shuffledList
                  state.songlist.currentSongIndex = 0
                  state.playerState.isShuffleActive = true
                })
              }
            },
            playNextSong: () => {
              const { loopState } = get().playerState
              const { hasNextSong, resetProgress, playFirstSongInQueue } =
                get().actions

              if (hasNextSong()) {
                resetProgress()
                set((state) => {
                  state.songlist.currentSongIndex += 1
                })
              } else if (loopState === LoopState.All) {
                resetProgress()
                playFirstSongInQueue()
              }
            },
            playPrevSong: () => {
              if (get().actions.hasPrevSong()) {
                get().actions.resetProgress()
                set((state) => {
                  state.songlist.currentSongIndex -= 1
                })
              }
            },
            clearPlayerState: () => {
              set((state) => {
                state.songlist.originalList = []
                state.songlist.shuffledList = []
                state.songlist.currentList = []
                state.songlist.currentSong = {} as ISong
                state.songlist.radioList = []
                state.songlist.originalSongIndex = 0
                state.songlist.currentSongIndex = 0
                state.playerState.mediaType = 'song'
                state.playerState.isPlaying = false
                state.playerState.loopState = LoopState.Off
                state.playerState.isShuffleActive = false
                state.playerState.queueDrawerState = false
                state.playerState.currentDuration = 0
                state.playerState.audioPlayerRef = null
              })
            },
            resetProgress: () => {
              set((state) => {
                state.playerProgress.progress = 0
              })
            },
            setProgress: (progress) => {
              set((state) => {
                state.playerProgress.progress = progress
              })
            },
            setVolume: (volume) => {
              set((state) => {
                state.playerState.volume = volume
              })
            },
            handleVolumeWheel: (isScrollingDown) => {
              const { min, max, wheelStep } = get().settings.volume
              const { volume } = get().playerState

              const volumeAdjustment = isScrollingDown ? -wheelStep : wheelStep
              const adjustedVolume = volume + volumeAdjustment
              const finalVolume = clamp(adjustedVolume, min, max)

              set((state) => {
                state.playerState.volume = finalVolume
              })
            },
            setCurrentDuration: (duration) => {
              set((state) => {
                state.playerState.currentDuration = duration
              })
            },
            hasNextSong: () => {
              const { mediaType } = get().playerState
              const { currentList, currentSongIndex, radioList } =
                get().songlist

              const nextIndex = currentSongIndex + 1

              if (mediaType === 'song') {
                return nextIndex < currentList.length
              } else {
                return nextIndex < radioList.length
              }
            },
            hasPrevSong: () => {
              const { currentSongIndex } = get().songlist
              return currentSongIndex > 0
            },
            isPlayingOneSong: () => {
              const { currentList } = get().songlist
              return currentList.length === 1
            },
            checkActiveSong: (id: string) => {
              const currentSong = get().songlist.currentSong
              if (currentSong) {
                return id === currentSong.id
              } else {
                return false
              }
            },
            checkIsSongStarred: () => {
              const { currentList, currentSongIndex } = get().songlist
              const { mediaType } = get().playerState
              const song = currentList[currentSongIndex]

              if (mediaType === 'song' && song) {
                const isStarred = typeof song.starred === 'string'

                set((state) => {
                  state.playerState.isSongStarred = isStarred
                })
              } else {
                set((state) => {
                  state.playerState.isSongStarred = false
                })
              }
            },
            starSongInQueue: (id) => {
              const { currentList } = get().songlist
              const { mediaType } = get().playerState

              if (currentList.length === 0 && mediaType !== 'song') return

              const songIndex = currentList.findIndex((song) => song.id === id)
              if (songIndex === -1) return

              const songList = [...currentList]
              const isSongStarred =
                typeof songList[songIndex].starred === 'string'

              songList[songIndex] = {
                ...songList[songIndex],
                starred: isSongStarred ? undefined : new Date().toISOString(),
              }

              set((state) => {
                state.songlist.currentList = songList
              })
            },
            starCurrentSong: async () => {
              const { currentList, currentSongIndex } = get().songlist
              const { mediaType } = get().playerState

              if (currentList.length === 0 && mediaType !== 'song') return

              const { id, starred } = get().songlist.currentSong
              const isSongStarred = typeof starred === 'string'
              await subsonic.star.handleStarItem({
                id,
                starred: isSongStarred,
              })

              const songList = [...currentList]
              songList[currentSongIndex] = {
                ...songList[currentSongIndex],
                starred: isSongStarred ? undefined : new Date().toISOString(),
              }

              set((state) => {
                state.songlist.currentList = songList
              })
            },
            setAudioPlayerRef: (audioPlayer) => {
              set(
                produce((state: IPlayerContext) => {
                  state.playerState.audioPlayerRef = audioPlayer
                }),
              )
            },
            removeSongFromQueue: (id) => {
              const {
                currentList,
                originalList,
                shuffledList,
                currentSongIndex,
                originalSongIndex,
              } = get().songlist

              // Get the removed song index to adjust the current one.
              const removedSongIndex = currentList.findIndex(
                (song) => song.id === id,
              )
              const newCurrentList = currentList.filter(
                (song) => song.id !== id,
              )

              // Clear player state if list is empty
              if (newCurrentList.length === 0) {
                get().actions.clearPlayerState()
                return
              }

              // In case of removing current song, resets the progress
              if (removedSongIndex === currentSongIndex) {
                get().actions.resetProgress()
              }

              const newOriginalList = originalList.filter(
                (song) => song.id !== id,
              )
              const newShuffledList = shuffledList.filter(
                (song) => song.id !== id,
              )

              // Update index to fit new current list
              const updatedCurrentIndex = Math.min(
                currentSongIndex -
                  (removedSongIndex < currentSongIndex ? 1 : 0),
                newCurrentList.length - 1,
              )

              // Update original index
              const removedOriginalIndex = originalList.findIndex(
                (song) => song.id === id,
              )
              const updatedOriginalIndex = Math.min(
                originalSongIndex -
                  (removedOriginalIndex < originalSongIndex ? 1 : 0),
                newOriginalList.length - 1,
              )

              set((state) => {
                state.songlist.currentList = newCurrentList
                state.songlist.originalList = newOriginalList
                state.songlist.shuffledList = newShuffledList
                state.songlist.currentSongIndex = updatedCurrentIndex
                state.songlist.originalSongIndex = updatedOriginalIndex
              })
            },
            setQueueDrawerState: (status) => {
              set((state) => {
                state.playerState.queueDrawerState = status
              })
            },
            playFirstSongInQueue: () => {
              set((state) => {
                state.songlist.currentSongIndex = 0
              })
            },
            handleSongEnded: () => {
              const { loopState } = get().playerState
              const {
                hasNextSong,
                playNextSong,
                setPlayingState,
                clearPlayerState,
              } = get().actions

              if (hasNextSong() || loopState === LoopState.All) {
                playNextSong()
                setPlayingState(true)
              } else {
                clearPlayerState()
                setPlayingState(false)
              }
            },
            getCurrentProgress: () => {
              return get().playerProgress.progress
            },
            resetConfig: () => {
              set((state) => {
                state.settings.fullscreen.autoFullscreenEnabled = false
                state.settings.lyrics.preferSyncedLyrics = false
                state.settings.replayGain.values = {
                  enabled: false,
                  type: 'track',
                  preAmp: 0,
                  error: false,
                  defaultGain: -6,
                }
              })
            },
          },
        })),
        { name: 'player_store' },
      ),
      {
        name: 'player_store',
        version: 1,
        merge: (persistedState, currentState) => {
          return merge(currentState, persistedState)
        },
        partialize: (state) => {
          const appStore = omit(state, [
            'actions',
            'playerState.isPlaying',
            'playerState.audioPlayerRef',
            'playerState.queueDrawerState',
          ])

          return appStore
        },
      },
    ),
  ),
  shallow,
)

usePlayerStore.subscribe(
  (state) => [state.songlist.currentList, state.songlist.currentSongIndex],
  () => {
    const playerStore = usePlayerStore.getState()

    playerStore.actions.checkIsSongStarred()
    playerStore.actions.setCurrentSong()

    const { currentList } = playerStore.songlist
    const { progress } = playerStore.playerProgress

    if (currentList.length === 0 && progress > 0) {
      playerStore.actions.resetProgress()
    }
  },
)

export const usePlayerActions = () => usePlayerStore((state) => state.actions)

export const usePlayerSonglist = () => usePlayerStore((state) => state.songlist)

export const usePlayerCurrentSong = () =>
  usePlayerStore((state) => state.songlist.currentSong)

export const usePlayerCurrentSongIndex = () =>
  usePlayerStore((state) => state.songlist.currentSongIndex)

export const usePlayerState = () => usePlayerStore((state) => state.playerState)

export const usePlayerProgress = () =>
  usePlayerStore((state) => state.playerProgress.progress)

export const usePlayerVolume = () => ({
  volume: usePlayerStore((state) => state.playerState.volume),
  setVolume: usePlayerStore((state) => state.actions.setVolume),
  handleVolumeWheel: usePlayerStore((state) => state.actions.handleVolumeWheel),
})

export const useVolumeSettings = () =>
  usePlayerStore((state) => state.settings.volume)

export const useReplayGainState = () => {
  const { enabled, type, preAmp, error, defaultGain } = usePlayerStore(
    (state) => state.settings.replayGain.values,
  )

  return {
    replayGainEnabled: enabled,
    replayGainType: type,
    replayGainPreAmp: preAmp,
    replayGainError: error,
    replayGainDefaultGain: defaultGain,
  }
}

export const useReplayGainActions = () =>
  usePlayerStore((state) => state.settings.replayGain.actions)

export const useFullscreenPlayerSettings = () =>
  usePlayerStore((state) => state.settings.fullscreen)

export const usePrivacySettings = () =>
  usePlayerStore((state) => state.settings.privacy)

export const useLyricsSettings = () =>
  usePlayerStore((state) => state.settings.lyrics)

export const usePlayerSettings = () => usePlayerStore((state) => state.settings)

export const usePlayerMediaType = () =>
  usePlayerStore((state) => state.playerState.mediaType)

export const usePlayerIsPlaying = () =>
  usePlayerStore((state) => state.playerState.isPlaying)

export const usePlayerDuration = () =>
  usePlayerStore((state) => state.playerState.currentDuration)

export const usePlayerSongStarred = () =>
  usePlayerStore((state) => state.playerState.isSongStarred)

export const usePlayerShuffle = () =>
  usePlayerStore((state) => state.playerState.isShuffleActive)

export const usePlayerLoop = () =>
  usePlayerStore((state) => state.playerState.loopState)

export const usePlayerRef = () =>
  usePlayerStore((state) => state.playerState.audioPlayerRef)

export const getVolume = () => usePlayerStore.getState().playerState.volume

export const useQueueDrawerState = () =>
  usePlayerStore((state) => state.playerState.queueDrawerState)

export const usePlayerCurrentList = () =>
  usePlayerStore((state) => state.songlist.currentList)
