export function createManualChunks(id: string) {
  const vendor = ['react', 'react-dom', 'react-router-dom']

  if (id.includes('node_modules')) {
    const modulePath = id.split('node_modules/')[1]
    const topLevelFolder = modulePath.split('/')[0]

    if (topLevelFolder !== '.pnpm') {
      return topLevelFolder
    }

    const scopedPackageName = modulePath.split('/')[1]
    const includes = (id: string) => scopedPackageName.includes(id)

    if (vendor.some((name) => scopedPackageName.startsWith(name))) {
      return 'vendor'
    }
    if (includes('i18n')) return 'i18n'
    if (includes('tailwind')) return 'tailwind'
    if (includes('tauri')) return 'tauri'
    if (includes('@tanstack')) return 'tanstack'
    if (includes('@radix-ui')) return 'radix'
    if (includes('markdown') || includes('remark')) return 'markdown'

    return undefined
  }
}
