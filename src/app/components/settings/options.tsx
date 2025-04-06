import {
  EarthLock,
  FileText,
  Globe,
  Headphones,
  Paintbrush,
} from 'lucide-react'
import { ComponentType } from 'react'
import { useTranslation } from 'react-i18next'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/app/components/ui/sidebar'
import { useAppSettings } from '@/store/app.store'

export type SettingsOptions =
  | 'appearance'
  | 'language'
  | 'audio'
  | 'content'
  | 'privacy'

interface OptionsData {
  id: SettingsOptions
  icon: ComponentType
}

const options: OptionsData[] = [
  { id: 'appearance', icon: Paintbrush },
  { id: 'language', icon: Globe },
  { id: 'audio', icon: Headphones },
  { id: 'content', icon: FileText },
  { id: 'privacy', icon: EarthLock },
]

export function SettingsOptions() {
  const { t } = useTranslation()
  const { currentPage, setCurrentPage } = useAppSettings()

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {options.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                isActive={item.id === currentPage}
                onClick={() => setCurrentPage(item.id)}
              >
                <item.icon />
                <span>{t(`settings.options.${item.id}`)}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
