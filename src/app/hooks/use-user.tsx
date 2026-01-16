import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { changePassword } from '@/api/navidromeClient'

export function useUser() {
  const { t } = useTranslation()

  async function userSetPassword(oldPassword, newPassword: string) {
    try {
      const result = await changePassword(oldPassword, newPassword)

      if (result.success) {
        toast.success(t('userParams.error.passwordChangeSuccess'))
      } else {
        toast.error(t('userParams.error.passwordChangeFailed'))
      }
      return result
    } catch (error) {
      toast.error(t('userParams.error.passwordChangeError', error))
      return { success: false, message: error.message }
    }
  }

  return {
    userSetPassword,
  }
}
