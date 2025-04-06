import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { isDev } from '@/utils/env'
import { resources } from './languages'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: isDev,
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false,
    },
    resources,
  })

export default i18n
