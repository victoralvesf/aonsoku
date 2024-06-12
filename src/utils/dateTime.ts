import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import 'dayjs/locale/pt-br'

import i18n from '@/i18n'
import { currentLanguages, languages } from '@/i18n/languages'

dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(updateLocale)

currentLanguages.forEach(lang => {
  const langCode = lang.langCode as keyof typeof languages
  dayjs.updateLocale(lang.dayjsLocale, languages[langCode].translation.dayjs)
})

const savedLang = localStorage.getItem('i18nextLng') || 'en'
dayjs.locale(savedLang)

i18n.on('languageChanged', (lang) => {
  dayjs.locale(lang)
})

const dateTime = dayjs
export default dateTime
