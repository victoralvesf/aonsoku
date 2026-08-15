export function createManualChunks(id: string) {
  // Style-only modules must stay attached to the entry that imports them.
  // Bucketing them into a shared vendor chunk leaks the app's CSS into the
  // OBS widget page, which ships its own stylesheet and must not inherit
  // rules like `body { padding: 6px }` from react-toastify.
  if (/\.(css|scss|sass|less)(\?.*)?$/.test(id)) return undefined

  const vendor = ['react-dom', 'react-router-dom']

  if (id.includes('node_modules')) {
    const modulePath = id.split('node_modules/')[1]
    const topLevelFolder = modulePath.split('/')[0]

    if (topLevelFolder !== '.pnpm') {
      return topLevelFolder
    }

    const scopedPackageName = modulePath.split('/')[1]
    const includes = (id: string) => scopedPackageName.includes(id)
    const includesAny = (ids: string[]) => ids.some(includes)

    if (includes('i18n')) return 'i18n'
    if (includes('tailwind')) return 'tailwind'
    if (includesAny(['html-to-text', 'linkify-it'])) return 'formatters'
    if (includes('lucide')) return 'lucide'
    if (includes('embla')) return 'embla'
    if (includes('dayjs')) return 'date-time'
    if (includes('audio-context')) return 'audio-context'
    if (includes('crypto')) return 'crypto'
    if (includes('lodash')) return 'lodash'
    if (includes('tanstack')) return 'tanstack'
    if (includes('radix')) return 'radix'
    if (includesAny(['markdown', 'remark', 'rehype'])) return 'markdown'
    if (includesAny(['react-hook-form', 'zod'])) return 'forms'
    if (includes('dompurify')) return 'sanitizer'
    if (includesAny(['zustand', 'immer', 'use-sync-external-store']))
      return 'state'
    if (includesAny(['fast-average-color', 'idb-keyval', 'iso-639-2']))
      return 'misc'
    if (vendor.some((name) => scopedPackageName.startsWith(name))) {
      return 'vendor-dom'
    }
    if (scopedPackageName.startsWith('react')) return 'vendor'

    return undefined
  }

  if (id.includes('/src/i18n/locales/')) {
    const lang = id.split('/src/i18n/locales/')[1].replace('.json', '')
    return `locale-${lang}`
  }

  return undefined
}
