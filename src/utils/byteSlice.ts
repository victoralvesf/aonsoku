export function byteSlice(
  value: string,
  byteStart: number,
  byteEnd: number,
): string {
  if (!value) return ''
  if (byteStart > byteEnd) {
    if (import.meta.env.DEV)
      console.warn('[byteSlice] byteStart > byteEnd', { byteStart, byteEnd })
    return ''
  }
  const encoded = new TextEncoder().encode(value)
  const start = Math.max(0, byteStart)
  const end = Math.min(encoded.length - 1, byteEnd)
  if (start > encoded.length - 1) return ''
  return new TextDecoder('utf-8', { fatal: false }).decode(
    encoded.slice(start, end + 1),
  )
}

export function byteSliceFallback(
  cue: { value?: string; byteStart?: number; byteEnd?: number },
  lineValue: string,
): string {
  if (cue.byteStart !== undefined && cue.byteEnd !== undefined) {
    return byteSlice(lineValue, cue.byteStart, cue.byteEnd)
  }
  return cue.value ?? ''
}
