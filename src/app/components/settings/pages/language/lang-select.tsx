import { ReactCountryFlag } from 'react-country-flag'
import { useTranslation } from 'react-i18next'
import {
  Content,
  ContentItem,
  ContentItemForm,
  ContentItemTitle,
  ContentSeparator,
  Root,
} from '@/app/components/settings/section'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import { languages } from '@/i18n/languages'
import { useLang } from '@/store/lang.store'

export function LangSelect() {
  const { t } = useTranslation()
  const { langCode, setLang, flag, langNativeName } = useLang()

  function handleValueChange(lang: string) {
    if (lang === langCode) return

    setLang(lang)
  }

  return (
    <Root>
      <Content>
        <ContentItem>
          <ContentItemTitle>{t('menu.language')}</ContentItemTitle>
          <ContentItemForm>
            <Select value={langCode} onValueChange={handleValueChange}>
              <SelectTrigger className="h-8 ring-offset-transparent focus:ring-0 focus:ring-transparent text-left">
                <SelectValue>
                  <ReactCountryFlag countryCode={flag} svg className="mr-2" />
                  <span className="text-sm text-foreground">
                    {langNativeName}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent align="end">
                <SelectGroup>
                  {languages.map((language) => (
                    <SelectItem
                      key={language.langCode}
                      value={language.langCode}
                    >
                      <ReactCountryFlag
                        countryCode={language.flag}
                        svg
                        className="mr-2"
                      />
                      <span className="text-sm text-foreground">
                        {language.nativeName}
                      </span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </ContentItemForm>
        </ContentItem>
      </Content>
      <ContentSeparator />
    </Root>
  )
}
