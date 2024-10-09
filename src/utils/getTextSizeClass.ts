export function getTextSizeClass(text: string) {
  if (text.length > 40) {
    return 'text-3xl 2xl:text-5xl leading-[1.1] 2xl:leading-[1.2]'
  }

  return 'text-4xl 2xl:text-6xl leading-[1.05] 2xl:leading-[1.1]'
}
