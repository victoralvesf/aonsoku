export function formatBitrate(bitrate: number) {
  return `${bitrate} kbps`
}

export function formatSamplingRate(samplingRate?: number) {
  if (!samplingRate) return '-'

  return `${samplingRate / 1000} kHz`
}
