import { ReactNode, createContext, useCallback, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { CreateRadio, Radio } from "@/types/responses/radios";
import { subsonic } from "@/service/subsonic";

interface RadiosContextState {
  data: Radio
  setData: (data: Radio) => void
  radios: Radio[]
  setRadios: (radios: Radio[]) => void
  fetchRadios: () => void
  dialogState: boolean
  setDialogState: (state: boolean) => void
  confirmDeleteState: boolean
  setConfirmDeleteState: (state: boolean) => void
  createRadio: (data: CreateRadio) => Promise<void>
  updateRadio: (data: Radio) => Promise<void>
  deleteRadio: (id: string) => Promise<void>
}

const RadiosContext = createContext({} as RadiosContextState)

export function RadiosProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Radio>({} as Radio)
  const [radios, setRadios] = useState<Radio[]>([])
  const [dialogState, setDialogState] = useState(false)
  const [confirmDeleteState, setConfirmDeleteState] = useState(false)

  const { t } = useTranslation()

  const fetchRadios = useCallback(async () => {
    try {
      const response = await subsonic.radios.getAll()
      response ? setRadios(response) : setRadios([])
    } catch (_) { }
  }, [])

  const createRadio = useCallback(async (data: CreateRadio) => {
    try {
      await subsonic.radios.create(data)
      await fetchRadios()

      toast.success(t('radios.form.create.toast.success'))
    } catch (_) {
      toast.error(t('radios.form.create.toast.success'))
    }
  }, [])

  const updateRadio = useCallback(async (data: Radio) => {
    try {
      await subsonic.radios.update(data)
      await fetchRadios()

      toast.success(t('radios.form.edit.toast.success'))
    } catch (_) {
      toast.error(t('radios.form.edit.toast.success'))
    }
  }, [])

  const deleteRadio = useCallback(async (id: string) => {
    try {
      await subsonic.radios.remove(id)
      await fetchRadios()

      toast.success(t('radios.form.delete.toast.success'))
    } catch (_) {
      toast.error(t('radios.form.delete.toast.success'))
    }
  }, [])

  const value: RadiosContextState = {
    data,
    setData,
    radios,
    setRadios,
    fetchRadios,
    dialogState,
    setDialogState,
    confirmDeleteState,
    setConfirmDeleteState,
    createRadio,
    updateRadio,
    deleteRadio
  }

  return (
    <RadiosContext.Provider value={value}>
      {children}
    </RadiosContext.Provider>
  )
}


export const useRadios = () => {
  const context = useContext(RadiosContext)

  if (context === undefined)
    throw new Error("useRadios must be used within a RadiosProvider")

  return context
}
