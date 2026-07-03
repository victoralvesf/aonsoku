export function ensureSupportForAlac(suffix: string | undefined) {
  if (suffix === 'm4a') return 'opus'

  return suffix
}
