export function getTextSizeClass(text: string) {
  const base = (value: string) => `${value} text-balance align-baseline`

  if (text.length < 15) {
    return base(
      'text-6xl 2xl:text-7xl leading-[4.75rem] 2xl:leading-[5.625rem]',
    )
  }

  if (text.length > 40) {
    return base('text-3xl 2xl:text-5xl leading-[2.65rem] 2xl:leading-[4rem]')
  }

  return base('text-4xl 2xl:text-6xl leading-[3rem] 2xl:leading-[5rem]')
}
