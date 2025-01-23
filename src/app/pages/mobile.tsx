import { useTranslation } from 'react-i18next'
import { appName } from '@/utils/appName'

export function Mobile() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-1 w-screen h-screen items-center justify-center px-6 text-center bg-slate-800 text-slate-200 text-xl">
      <p>{t('mobile.unsupported_message', { app_name: appName })}</p>
      <p>{t('mobile.access_recommendation')}</p>
    </div>
  )
}
