import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createWithEqualityFn } from 'zustand/traditional'
import { IRadiosContext } from '@/types/radiosContext'
import { Radio } from '@/types/responses/radios'

export const useRadiosStore = createWithEqualityFn<IRadiosContext>()(
  subscribeWithSelector(
    devtools(
      immer((set) => ({
        data: {} as Radio,
        dialogState: false,
        confirmDeleteState: false,
        setData: (data) => {
          set((state) => {
            state.data = data
          })
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
      })),
      {
        name: 'radios_store',
      },
    ),
  ),
)

export const useRadios = () => useRadiosStore((state) => state)
