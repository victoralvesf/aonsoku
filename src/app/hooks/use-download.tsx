import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { isDesktop } from '@/utils/desktop'
import { logger } from '@/utils/logger'

export function useDownload() {
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

  const failed = useCallback(() => {
    toast.update('download', {
      render: t('downloads.failed'),
      type: 'error',
      autoClose: 5000,
      isLoading: false,
    })
  }, [t])

  useEffect(() => {
    const setupListeners = async () => {
      if (isDesktop()) {
        window.api.downloadCompletedListener(() => {
          completed()
        })
      }
    }

    setupListeners()
  }, [completed])

  function downloadBrowser(url: string, id = '') {
    // TODO: Maybe change in the future?
    const element = document.createElement('a')
    element.setAttribute('href', url)
    element.setAttribute('target', '_blank')
    element.setAttribute('download', id)

    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    toast.success(t('downloads.started'))
  }

  async function downloadDesktop(url: string, id: string) {
    started()
    window.api.downloadFile({
      url,
      fileId: id,
    })

    window.api.downloadFailedListener((fileId) => {
      logger.error('[DownloadDesktop] - Failed to download fileId:', fileId)
      failed()
    })
  }

  return {
    downloadBrowser,
    downloadDesktop,
  }
}
