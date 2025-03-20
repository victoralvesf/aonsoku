import { useAppSettings } from '@/store/app.store'
import { Appearance } from './appearance'
import { Audio } from './audio'
import { Content } from './content'
import { Language } from './language'
import { Privacy } from './privacy'

const pages = {
  appearance: <Appearance />,
  audio: <Audio />,
  language: <Language />,
  content: <Content />,
  privacy: <Privacy />,
}

export function Pages() {
  const { currentPage } = useAppSettings()

  return pages[currentPage]
}
