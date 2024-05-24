import dateTime from "./dateTime";

export function convertSecondsToTime(seconds: number): string {
  return dateTime.duration(seconds, 'seconds').format('mm:ss')
}
