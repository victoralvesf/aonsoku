export const saltWord = '40n50kuPl4y3r'

export function toHex(s: string) {
  return s
    .split('')
    .map((c) => c.charCodeAt(0).toString(16))
    .join('')
}
