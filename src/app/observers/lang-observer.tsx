import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLang } from '@/store/lang.store'

export function LangObserver() {
  const { i18n } = useTranslation()
  const { setLang, langCode } = useLang()

  useEffect(() => {
    const lang = i18n.resolvedLanguage
    if (lang) {
      setLang(lang)
    }
  }, [i18n.resolvedLanguage, setLang])

  useEffect(() => {
    if (langCode) {
      i18n.changeLanguage(langCode)
    }
  }, [i18n, langCode])

  return null
}
