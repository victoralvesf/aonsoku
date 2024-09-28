import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createWithEqualityFn } from 'zustand/traditional'
import { IUiContext } from '@/types/uiContext'

export const useUiStore = createWithEqualityFn<IUiContext>()(
  subscribeWithSelector(
    devtools(
      immer((set) => ({
        songInfo: {
          songId: '',
          setSongId: (id) => {
            set((state) => {
              state.songInfo.songId = id
            })
          },
          modalOpen: false,
          setModalOpen: (open) => {
            set((state) => {
              state.songInfo.modalOpen = open
            })
          },
          reset: () => {
            set((state) => {
              state.songInfo.songId = ''
              state.songInfo.modalOpen = false
            })
          },
        },
      })),
      {
        name: 'ui_store',
      },
    ),
  ),
)

export const useSongInfo = () => useUiStore((state) => state.songInfo)
