import { produce } from 'immer'
import { pick } from 'lodash'
import merge from 'lodash/merge'
import { devtools, subscribeWithSelector, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'
import { subsonic } from '@/service/subsonic'
import { IPlayerContext } from '@/types/playerContext'
import { ISong } from '@/types/responses/song'
import { shuffleSongList } from '@/utils/shuffleArray'

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
            isLoopActive: false,
            isShuffleActive: false,
            isSongStarred: false,
            volume: 100,
            currentDuration: 0,
            mediaType: 'song',
            audioPlayerRef: null,
          },
          playerProgress: {
            progress: 0,
          },
          actions: {
            setSongList: (songlist, index, shuffle = false) => {
              set((state) => {
                state.songlist.originalList = songlist
                state.songlist.originalSongIndex = index
                state.playerState.mediaType = 'song'
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
                set((state) => {
                  state.playerState.mediaType = 'song'
                  state.songlist.currentList = [song]
                  state.songlist.currentSongIndex = 0
                  state.playerState.isShuffleActive = false
                  state.playerState.isPlaying = true
                })
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
              set((state) => {
                state.playerState.isLoopActive = !state.playerState.isLoopActive
              })
            },
            toggleShuffle: () => {
              const { isShuffleActive } = get().playerState

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
              if (get().actions.hasNextSong()) {
                set((state) => {
                  state.songlist.currentSongIndex += 1
                })
              }
            },
            playPrevSong: () => {
              if (get().actions.hasPrevSong()) {
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
                state.songlist.radioList = []
                state.songlist.originalSongIndex = 0
                state.songlist.currentSongIndex = 0
                state.playerState.isPlaying = false
                state.playerState.isLoopActive = false
                state.playerState.isShuffleActive = false
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
            setCurrentDuration: (duration) => {
              set((state) => {
                state.playerState.currentDuration = duration
              })
            },
            hasNextSong: () => {
              const { mediaType, isShuffleActive } = get().playerState
              const { currentList, currentSongIndex, radioList } =
                get().songlist

              if (mediaType === 'song') {
                return (
                  isShuffleActive || currentSongIndex + 1 < currentList.length
                )
              } else {
                return currentSongIndex + 1 < radioList.length
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
              await subsonic.star.handleStarItem(id, isSongStarred)

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
          const playerState = pick(state.playerState, [
            'isLoopActive',
            'isShuffleActive',
            'volume',
          ])

          return {
            playerState,
          }
        },
      },
    ),
  ),
  shallow,
)

usePlayerStore.subscribe(
  (state) => [state.songlist.currentList, state.songlist.currentSongIndex],
  () => {
    usePlayerStore.getState().actions.checkIsSongStarred()
    usePlayerStore.getState().actions.setCurrentSong()
  },
)

export const usePlayerActions = () => usePlayerStore((state) => state.actions)

export const usePlayerSonglist = () => usePlayerStore((state) => state.songlist)

export const usePlayerProgress = () =>
  usePlayerStore((state) => state.playerProgress.progress)

export const usePlayerState = () => usePlayerStore((state) => state.playerState)

export const usePlayerVolume = () => ({
  volume: usePlayerStore((state) => state.playerState.volume),
  setVolume: usePlayerStore((state) => state.actions.setVolume),
})

export const usePlayerMediaType = () =>
  usePlayerStore((state) => state.playerState.mediaType)

export const usePlayerIsPlaying = () =>
  usePlayerStore((state) => state.playerState.isPlaying)

export const usePlayerDuration = () =>
  usePlayerStore((state) => state.playerState.currentDuration)
