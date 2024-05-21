import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

const dateTime = dayjs
export default dateTime

export function formatPlaylistDuration(seconds: number) {
  const dur = dateTime.duration(seconds, 'seconds');
  const hours = Math.floor(dur.asHours());
  const minutes = dur.minutes();
  
  return `${String(hours).padStart(2, '0')} hr ${String(minutes).padStart(2, '0')} min`;
}
