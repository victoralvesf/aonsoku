import { produce } from 'immer'
import { omit } from 'lodash'
import merge from 'lodash/merge'
import { create } from 'zustand'
import { devtools, subscribeWithSelector, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { subsonic } from '@/service/subsonic'
import { IPlayerContext } from '@/types/playerContext'
import { shuffleSongList } from '@/utils/shuffleArray'

export const usePlayerStore = create<IPlayerContext>()(
  subscribeWithSelector(
    persist(
      devtools(
        immer((set, get) => ({
          songlist: {
            shuffledList: [],
            originalList: [],
            originalSongIndex: 0,
            currentList: [],
            currentSongIndex: 0,
            radioList: [],
          },
          playerState: {
            isPlaying: false,
            isLoopActive: false,
            isShuffleActive: false,
            isSongStarred: false,
            progress: 0,
            volume: 100,
            currentDuration: 0,
            mediaType: 'song',
            audioPlayerRef: null,
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
                const currentSongId = get().actions.getCurrentSong().id
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
                state.playerState.isSongStarred = false
                state.playerState.progress = 0
              })
            },
            setProgress: (progress) => {
              set((state) => {
                state.playerState.progress = progress
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
              const currentSong = get().actions.getCurrentSong()
              if (currentSong) {
                return id === currentSong.id
              } else {
                return false
              }
            },
            getCurrentSong: () => {
              const currentList = get().songlist.currentList
              const currentSongIndex = get().songlist.currentSongIndex

              return currentList[currentSongIndex]
            },
            setIsSongStarred: (status) => {
              set((state) => {
                state.playerState.isSongStarred = status
              })
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

              const { id, starred } = get().actions.getCurrentSong()
              const isSongStarred = typeof starred === 'string'
              await subsonic.star.handleStarItem(id, isSongStarred)

              const songList = [...currentList]
              songList[currentSongIndex] = {
                ...songList[currentSongIndex],
                starred: isSongStarred ? undefined : new Date().toISOString(),
              }

              set((state) => {
                state.playerState.isSongStarred = !isSongStarred
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
          const playerState = omit(state.playerState, 'audioPlayerRef')

          return {
            songlist: state.songlist,
            playerState,
          }
        },
      },
    ),
  ),
)

export const usePlayerActions = () => usePlayerStore((state) => state.actions)
export const usePlayerSonglist = () => usePlayerStore((state) => state.songlist)
export const usePlayerState = () => usePlayerStore((state) => state.playerState)
