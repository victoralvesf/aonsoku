export function shuffleSongList<T>(list: T[], index: number, isRandom = false) {
  const array = [...list]
  const firstPositionItem = array[index]

  if (!isRandom) {
    array.splice(index, 1)
  }

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }

  if (!isRandom) {
    array.unshift(firstPositionItem)
  }

  return array
}

export function addNextSongList<T>(
  index: number,
  currentList: T[],
  newList: T[],
) {
  const firstPart = currentList.slice(0, index + 1)
  const secondPart = currentList.slice(index + 1)

  const updated = [...firstPart, ...newList, ...secondPart]

  return updated
}
