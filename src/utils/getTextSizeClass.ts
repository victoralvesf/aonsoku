export function getTextSizeClass(text: string) {
  if (text.length > 40) {
    return 'text-3xl 2xl:text-5xl'
  }

  return 'text-4xl 2xl:text-6xl'
}
