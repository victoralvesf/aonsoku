import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { getShareUrl } from '@/api/httpClient'

export function useShare() {
  const { t } = useTranslation()

  const started = useCallback(() => {
    toast(t('downloads.started'), {
      autoClose: false,
      type: 'default',
      isLoading: true,
      toastId: 'download',
    })
  }, [t])

  const completed = useCallback(() => {
    toast.update('download', {
      render: t('downloads.completed'),
                 type: 'success',
                 autoClose: 5000,
                 isLoading: false,
    })
  }, [t])


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

