export function getTextSizeClass(text: string) {
  if (text.length > 40) {
    return 'text-3xl 2xl:text-5xl leading-[2.25rem] 2xl:leading-[3.75rem]'
  }

  return 'text-4xl 2xl:text-6xl leading-[2.75rem] 2xl:leading-[4.75rem]'
}
