import { MouseEvent } from "react"
import { useTranslation } from "react-i18next"
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
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/routes/routesList"

interface AlertDialogProps {
  openDialog: boolean
  setOpenDialog: (value: boolean) => void
}

export function LogoutConfirmDialog({ openDialog, setOpenDialog }: AlertDialogProps) {
  const { handleRemoveServerConfig } = useApp()
  const navigate = useNavigate()
  const { t } = useTranslation()

  async function handleRemoveConfig(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    await handleRemoveServerConfig()
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
