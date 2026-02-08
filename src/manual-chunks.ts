export function createManualChunks(id: string) {
  const vendor = ['react-dom', 'react-router-dom']

  if (id.includes('node_modules')) {
    const modulePath = id.split('node_modules/')[1]
    const topLevelFolder = modulePath.split('/')[0]

    if (topLevelFolder !== '.pnpm') {
      return topLevelFolder
    }

    const scopedPackageName = modulePath.split('/')[1]
    const includes = (id: string) => scopedPackageName.includes(id)

    if (includes('i18n')) return 'i18n'
    if (includes('tailwind')) return 'tailwind'
    if (includes('html-to-text') || includes('linkify-it')) return 'formatters'
    if (includes('lucide')) return 'lucide'
    if (includes('embla')) return 'embla'
    if (includes('dayjs')) return 'date-time'
    if (includes('audio-context')) return 'audio-context'
    if (includes('crypto')) return 'crypto'
    if (includes('lodash')) return 'lodash'
    if (includes('tanstack')) return 'tanstack'
    if (includes('radix')) return 'radix'
    if (includes('markdown') || includes('remark') || includes('rehype'))
      return 'markdown'
    if (includes('react-hook-form') || includes('zod')) return 'forms'
    if (vendor.some((name) => scopedPackageName.startsWith(name))) {
      return 'vendor-dom'
    }
    if (scopedPackageName.startsWith('react')) return 'vendor'

    return undefined
  }

  return undefined
}
