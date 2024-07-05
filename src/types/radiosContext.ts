import { CreateRadio, Radio } from './responses/radios'

export interface IRadiosContext {
  data: Radio
  radios: Radio[]
  dialogState: boolean
  confirmDeleteState: boolean
  setData: (data: Radio) => void
  setRadios: (radios: Radio[]) => void
  fetchRadios: () => Promise<void>
  setDialogState: (state: boolean) => void
  setConfirmDeleteState: (state: boolean) => void
  createRadio: (data: CreateRadio) => Promise<void>
  updateRadio: (data: Radio) => Promise<void>
  deleteRadio: (id: string) => Promise<void>
}
