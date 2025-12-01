import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLang } from '@/store/lang.store'

export function LangObserver() {
  const { i18n } = useTranslation()
  const { langCode, setLang } = useLang()

  const setLangOnHtml = useCallback((lang: string) => {
    const root = window.document.documentElement
    root.removeAttribute('lang')
    root.setAttribute('lang', lang)
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: initial only useEffect
  useEffect(() => {
    const lang = i18n.resolvedLanguage
    if (lang && lang !== '') {
      setLang(lang)
    }
  }, [])

  useEffect(() => {
    if (langCode) {
      i18n.changeLanguage(langCode)
      setLangOnHtml(langCode)
    }
  }, [i18n, langCode, setLangOnHtml])

  return null
}
