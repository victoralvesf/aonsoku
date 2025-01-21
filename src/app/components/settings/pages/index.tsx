import { useAppSettings } from '@/store/app.store'
import { Appearance } from './appearance'
import { Audio } from './audio'
import { Content } from './content'
import { Language } from './language'

const pages = {
  appearance: <Appearance />,
  audio: <Audio />,
  language: <Language />,
  content: <Content />,
}

export function Pages() {
  const { currentPage } = useAppSettings()

  return pages[currentPage]
}
