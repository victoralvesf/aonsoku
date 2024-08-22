import i18n from '@/i18n'
import dateTime from './dateTime'

export function convertSecondsToTime(seconds: number): string {
  const duration = dateTime.duration(seconds, 'seconds')
  const hours = duration.hours()

  if (hours > 0) {
    return duration.format('HH:mm:ss')
  } else {
    return duration.format('mm:ss')
  }
}

export function convertSecondsToHumanRead(time: number) {
  const dur = dateTime.duration(time, 'seconds')

  const numberOfDays = Math.floor(dur.days())
  const numberOfHours = dur.hours()
  const numberOfMinutes = dur.minutes()
  const numberOfSeconds = dur.seconds()

  const days = i18n.t('time.days', { days: dur.format('DD') })
  const hours = i18n.t('time.hour', { hour: dur.format('HH') })
  const minutes = i18n.t('time.minutes', { minutes: dur.format('mm') })
  const seconds = i18n.t('time.seconds', { seconds: dur.format('ss') })

  const finalText = []

  if (numberOfDays > 0) finalText.push(days)
  if (numberOfHours > 0) finalText.push(hours)
  if (!(numberOfHours > 0 && numberOfMinutes === 0)) finalText.push(minutes)
  if (numberOfHours === 0 && numberOfSeconds !== 0) finalText.push(seconds)

  return finalText.join(' ')
}

export function convertMinutesToMs(minutes: number): number {
  return 60 * minutes * 1000
}
