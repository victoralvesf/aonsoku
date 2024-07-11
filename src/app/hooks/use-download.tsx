import { once } from '@tauri-apps/api/event'
import { invoke } from '@tauri-apps/api/tauri'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { isTauri } from '@/utils/tauriTools'

export function useDownload() {
  useEffect(() => {
    const setupListeners = async () => {
      if (isTauri()) {
        await once('DOWNLOAD_FINISHED', () => {
          // TODO: add i18n
          toast.success('File downloaded successfully', {
            toastId: 'download-success',
          })
        })
      }
    }

    setupListeners()
  }, [])

  function downloadBrowser(url: string) {
    window.location.href = url
    // TODO: add i18n
    toast.success('Download started')
  }

  async function downloadTauri(url: string, id: string) {
    try {
      const fileName = `${id}.zip`
      // TODO: add i18n
      toast.success('Download started')

      await invoke('download_file', { url, fileName, fileId: id })
    } catch (_) {
      // TODO: add i18n
      toast.error('Failed to download')
    }
  }

  return {
    downloadBrowser,
    downloadTauri,
  }
}
