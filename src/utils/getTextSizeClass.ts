export function getTextSizeClass(text: string) {
  if (text.length > 40) {
    return 'text-3xl lg:text-5xl'
  }

  return 'text-5xl lg:text-7xl'
}