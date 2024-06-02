import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import 'dayjs/locale/pt-BR'

import i18n from '@/i18n'

import { english } from '@/i18n/languages/en'
import { brazilianPortuguese } from '@/i18n/languages/pt-BR'

dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(updateLocale)

dayjs.updateLocale('en', english.translation.dayjs)
dayjs.updateLocale('pt-br', brazilianPortuguese.translation.dayjs)

const savedLang = localStorage.getItem('i18nextLng') || 'en'
dayjs.locale(savedLang)

i18n.on('languageChanged', (lang) => {
  dayjs.locale(lang)
})

const dateTime = dayjs
export default dateTime
