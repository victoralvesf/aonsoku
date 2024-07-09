import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLang } from '@/store/lang.store'

export function LangObserver() {
  const { i18n } = useTranslation()
  const { langCode, setLang } = useLang()

  function setLangOnHtml(lang: string) {
    const root = window.document.documentElement
    root.removeAttribute('lang')
    root.setAttribute('lang', lang)
  }

  useEffect(() => {
    const lang = i18n.resolvedLanguage
    if (lang && lang !== '') {
      setLang(lang)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (langCode) {
      i18n.changeLanguage(langCode)
      setLangOnHtml(langCode)
    }
  }, [i18n, langCode])

  return null
}
