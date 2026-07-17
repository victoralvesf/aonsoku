// Generates a short, (near-)silent looping WAV as an object URL, used to keep
// the OS media session alive while the gapless engine plays through Web Audio.
// See the MediaSessionKeepAlive component.
//
// Browsers media-session heuristics generally require an audible media
// element with a duration over ~5s that is playing and not muted. We generate a
// 6s clip that is essentially silent.

let cachedUrl: string | null = null

const DURATION_S = 6
const SAMPLE_RATE = 8000
const AMPLITUDE = 0 // 0 = pure silence; raise (e.g., 2) if a browser ignores silence

function writeString(view: DataView, offset: number, text: string) {
  for (let i = 0; i < text.length; i++) {
    view.setUint8(offset + i, text.charCodeAt(i))
  }
}

function createSilentWavUrl(): string {
  const numSamples = DURATION_S * SAMPLE_RATE
  const dataSize = numSamples // 8-bit mono => 1 byte per sample
  const buffer = new ArrayBuffer(44 + dataSize)
  const view = new DataView(buffer)

  // Canonical 44-byte PCM WAV header.
  writeString(view, 0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeString(view, 8, 'WAVE')
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true) // fmt chunk size
  view.setUint16(20, 1, true) // audio format = PCM
  view.setUint16(22, 1, true) // channels = mono
  view.setUint32(24, SAMPLE_RATE, true)
  view.setUint32(28, SAMPLE_RATE, true) // byte rate = sampleRate * blockAlign
  view.setUint16(32, 1, true) // block align
  view.setUint16(34, 8, true) // bits per sample
  writeString(view, 36, 'data')
  view.setUint32(40, dataSize, true)

  // 8-bit PCM is unsigned; 128 is the zero level.
  const zero = 128
  for (let i = 0; i < numSamples; i++) {
    const sample =
      AMPLITUDE === 0 ? zero : zero + (i % 2 === 0 ? AMPLITUDE : -AMPLITUDE)
    view.setUint8(44 + i, sample)
  }

  const blob = new Blob([buffer], { type: 'audio/wav' })
  return URL.createObjectURL(blob)
}

// Lazy, app-lived singleton: one small in-memory blob, reused across mounts.
export function getSilentAudioUrl(): string {
  if (!cachedUrl) cachedUrl = createSilentWavUrl()
  return cachedUrl
}
