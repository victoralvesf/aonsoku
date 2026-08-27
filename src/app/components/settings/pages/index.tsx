import { SettingsOptions } from '@/app/components/settings/options'
import { useAppSettings } from '@/store/app.store'
import { Accessibility } from './accessibility'
import { Accounts } from './accounts'
import { Appearance } from './appearance'
import { Audio } from './audio'
import { Content } from './content'
import { Desktop } from './desktop'
import { Language } from './language'
import { Privacy } from './privacy'

const pages: Record<SettingsOptions, JSX.Element> = {
  appearance: <Appearance />,
  audio: <Audio />,
  language: <Language />,
  content: <Content />,
  accounts: <Accounts />,
  desktop: <Desktop />,
  accessibility: <Accessibility />,
  privacy: <Privacy />,
}

export function Pages() {
  const { currentPage } = useAppSettings()

  return pages[currentPage]
}
