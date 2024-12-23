import { useAppSettings } from '@/store/app.store'
import { Appearance } from './appearance'
import { Audio } from './audio'
import { Language } from './language'

const pages = {
  appearance: <Appearance />,
  audio: <Audio />,
  language: <Language />,
}

export function Pages() {
  const { currentPage } = useAppSettings()

  return pages[currentPage]
}
