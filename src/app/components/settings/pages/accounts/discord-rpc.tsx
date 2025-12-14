import { useTranslation } from 'react-i18next'
import {
  Content,
  ContentItem,
  ContentItemForm,
  ContentItemTitle,
  ContentSeparator,
  Header,
  HeaderDescription,
  HeaderTitle,
  Root,
} from '@/app/components/settings/section'
import { Switch } from '@/app/components/ui/switch'
import { useAppAccounts } from '@/store/app.store'

export function DiscordRpc() {
  const { t } = useTranslation()
  const { discord } = useAppAccounts()

  return (
    <Root>
      <Header>
        <HeaderTitle>{t('settings.accounts.discord.group')}</HeaderTitle>
        <HeaderDescription>
          {t('settings.accounts.discord.description')}
        </HeaderDescription>
      </Header>
      <Content>
        <ContentItem>
          <ContentItemTitle>
            {t('settings.accounts.discord.enabled.label')}
          </ContentItemTitle>
          <ContentItemForm>
            <Switch
              checked={discord.rpcEnabled}
              onCheckedChange={discord.setRpcEnabled}
            />
          </ContentItemForm>
        </ContentItem>
      </Content>
      <ContentSeparator />
    </Root>
  )
}
