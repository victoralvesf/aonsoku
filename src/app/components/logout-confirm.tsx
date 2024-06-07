import { MouseEvent } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { emit } from '@tauri-apps/api/event'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog"
import { useApp } from "@/app/contexts/app-context"
import { ROUTES } from "@/routes/routesList"
import { usePlayer } from "@/app/contexts/player-context"

interface AlertDialogProps {
  openDialog: boolean
  setOpenDialog: (value: boolean) => void
}

export function LogoutConfirmDialog({ openDialog, setOpenDialog }: AlertDialogProps) {
  const { handleRemoveServerConfig } = useApp()
  const navigate = useNavigate()
  const { clearPlayerState } = usePlayer()
  const { t } = useTranslation()

  async function handleRemoveConfig(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    await handleRemoveServerConfig()
    await emit('user-logged-out', {})
    clearPlayerState()
    navigate(ROUTES.SERVER_CONFIG)
  }

  return (
    <AlertDialog open={openDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('logout.dialog.title')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('logout.dialog.description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpenDialog(!openDialog)}>
            {t('logout.dialog.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleRemoveConfig}>
            {t('logout.dialog.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
