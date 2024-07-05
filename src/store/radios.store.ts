import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createWithEqualityFn } from 'zustand/traditional'
import { subsonic } from '@/service/subsonic'
import { IRadiosContext } from '@/types/radiosContext'
import { Radio } from '@/types/responses/radios'

export const useRadiosStore = createWithEqualityFn<IRadiosContext>()(
  subscribeWithSelector(
    devtools(
      immer((set, get) => ({
        data: {} as Radio,
        radios: [],
        dialogState: false,
        confirmDeleteState: false,
        setData: (data) => {
          set((state) => {
            state.data = data
          })
        },
        setRadios: (radios) => {
          set((state) => {
            state.radios = radios
          })
        },
        fetchRadios: async () => {
          const response = await subsonic.radios.getAll()

          if (response) {
            set((state) => {
              state.radios = response
            })
          }
        },
        setDialogState: (dialogState) => {
          set((state) => {
            state.dialogState = dialogState
          })
        },
        setConfirmDeleteState: (deleteState) => {
          set((state) => {
            state.confirmDeleteState = deleteState
          })
        },
        createRadio: async (radio) => {
          await subsonic.radios.create(radio)

          await get().fetchRadios()
        },
        updateRadio: async (radio) => {
          await subsonic.radios.update(radio)

          await get().fetchRadios()
        },
        deleteRadio: async (id) => {
          await subsonic.radios.remove(id)
          const { radios } = get()
          const indexToRemove = radios.findIndex((radio) => radio.id === id)

          if (indexToRemove === -1) return

          const updatedRadios = [...radios]
          updatedRadios.splice(indexToRemove, 1)

          set((state) => {
            state.radios = updatedRadios
          })
        },
      })),
      {
        name: 'radios_store',
      },
    ),
  ),
)

export const useRadios = () => useRadiosStore((state) => state)
