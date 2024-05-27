import { MouseEvent } from "react"
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

interface AlertDialogProps {
  openDialog: boolean
  setOpenDialog: (value: boolean) => void
}

export function LogoutConfirmDialog({ openDialog, setOpenDialog }: AlertDialogProps) {
  const { handleRemoveServerConfig } = useApp()

  async function handleRemoveConfig(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    await handleRemoveServerConfig()
  }

  return (
    <AlertDialog open={openDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ready to say goodbye for now?</AlertDialogTitle>
          <AlertDialogDescription>Confirm to log out.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpenDialog(!openDialog)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleRemoveConfig}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
