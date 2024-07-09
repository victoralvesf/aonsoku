import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import updateLocale from 'dayjs/plugin/updateLocale'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/pt-br'

import i18n from '@/i18n'
import { currentLanguages, languages } from '@/i18n/languages'

dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(updateLocale)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localizedFormat)

currentLanguages.forEach((lang) => {
  const langCode = lang.langCode as keyof typeof languages
  dayjs.updateLocale(lang.dayjsLocale, languages[langCode].translation.dayjs)
})

const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
dayjs.tz.setDefault(browserTimezone)

const savedLang = localStorage.getItem('i18nextLng') || 'en'
dayjs.locale(savedLang)

i18n.on('languageChanged', (lang: string) => {
  dayjs.locale(lang)
})

const dateTime = dayjs
export default dateTime
