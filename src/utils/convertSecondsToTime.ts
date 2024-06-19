import dateTime from './dateTime'

export function convertSecondsToTime(seconds: number): string {
  return dateTime.duration(seconds, 'seconds').format('mm:ss')
}

export function convertSecondsToHumanRead(
  seconds: number,
  showSeconds = false,
) {
  const dur = dateTime.duration(seconds, 'seconds')
  const hours = Math.floor(dur.asHours())
  const minutes = dur.minutes()
  const secs = dur.seconds()

  const formattedHours = `${String(hours).padStart(2, '0')} hr `
  const formattedMinutes = `${String(minutes).padStart(2, '0')} min `
  const formattedSeconds = `${String(secs).padStart(2, '0')} s`

  let finalText = ''

  if (hours > 0) finalText = formattedHours
  if (minutes > 0) finalText += formattedMinutes
  if (showSeconds) finalText += formattedSeconds

  return finalText.trim()
}
