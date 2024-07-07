import { useAppStore } from '@/store/app.store'
import { LogoutConfirmDialog } from '../components/logout-confirm'

export function LogoutObserver() {
  const logoutDialogState = useAppStore((state) => state.data.logoutDialogState)
  const setLogoutDialogState = useAppStore(
    (state) => state.actions.setLogoutDialogState,
  )

  return (
    <LogoutConfirmDialog
      openDialog={logoutDialogState}
      setOpenDialog={setLogoutDialogState}
    />
  )
}
