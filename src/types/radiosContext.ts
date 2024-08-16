import { Radio } from './responses/radios'

export interface IRadiosContext {
  data: Radio
  dialogState: boolean
  confirmDeleteState: boolean
  setData: (data: Radio) => void
  setDialogState: (state: boolean) => void
  setConfirmDeleteState: (state: boolean) => void
}
