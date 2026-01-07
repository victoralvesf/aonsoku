import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { getShareUrl } from '@/api/httpClient'

export function useShare() {
  const { t } = useTranslation()

  async function copyShareLinkToClipboard(id: string) {
    try {
      const response = await fetch(getShareUrl(id))
      const rawText = await response.text()
      console.log('Raw response:', rawText)

      const data = JSON.parse(rawText)
      console.log('Parsed JSON:', data)
      const shareUrl = data['subsonic-response']?.shares?.share?.[0]?.url

      if (shareUrl) {
        await navigator.clipboard.writeText(shareUrl)
        toast.success(t('about.toasts.copy'))
      } else {
        console.error('URL Not found in response!:', data)
        toast.error(t('about.toasts.copy-error'))
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error(t('about.toasts.copy-error'))
    }
  }
  return {
    copyShareLinkToClipboard,
  }
}

