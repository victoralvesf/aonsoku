import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  Content,
  ContentSeparator,
  Header,
  HeaderDescription,
  HeaderTitle,
  Root,
} from '@/app/components/settings/section'
import { Button } from '@/app/components/ui/button'
import { useWidgetActions, useWidgetData } from '@/store/widget.store'
import { WIDGET_MAX_PROFILES } from '@/types/widget'
import { ProfileCard } from './profile-card'

export function WidgetProfiles() {
  const { t } = useTranslation()
  const { port, profiles } = useWidgetData()
  const { addProfile } = useWidgetActions()

  const reachedLimit = profiles.length >= WIDGET_MAX_PROFILES

  function handleAdd() {
    addProfile(
      t('settings.widget.profiles.newName', { number: profiles.length + 1 }),
    )
  }

  return (
    <Root>
      <Header>
        <HeaderTitle>{t('settings.widget.profiles.group')}</HeaderTitle>
        <HeaderDescription>
          {t('settings.widget.profiles.description', {
            max: WIDGET_MAX_PROFILES,
          })}
        </HeaderDescription>
      </Header>
      <Content className="space-y-3">
        {profiles.length === 0 && (
          <p className="text-xs text-muted-foreground">
            {t('settings.widget.profiles.empty')}
          </p>
        )}

        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            port={port}
            canRemove={profiles.length > 1}
          />
        ))}

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            disabled={reachedLimit}
            onClick={handleAdd}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            {t('settings.widget.profiles.add')}
          </Button>
          {reachedLimit && (
            <span className="text-xs text-muted-foreground">
              {t('settings.widget.profiles.limit', {
                max: WIDGET_MAX_PROFILES,
              })}
            </span>
          )}
        </div>
      </Content>
      <ContentSeparator />
    </Root>
  )
}
