export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  // Ensure the number of decimals is at least 0
  const dm = Math.max(0, decimals)
  const sizes = [
    'Bytes',
    'KiB',
    'MiB',
    'GiB',
    'TiB',
    'PiB',
    'EiB',
    'ZiB',
    'YiB',
  ]

  // Calculate the sizes index based on logarithmic scale
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(dm))

  // Return the formatted value with the correct number of decimal places
  const formattedValue = value.toLocaleString('en', {
    minimumFractionDigits: dm,
    maximumFractionDigits: dm,
  })

  return `${formattedValue} ${sizes[i]}`
}
