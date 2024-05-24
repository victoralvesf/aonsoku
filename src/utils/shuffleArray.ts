export function shuffleSongList<T>(array: T[], index: number) {
  const firstPositionItem = array[index]

  array.splice(index, 1)

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  array.unshift(firstPositionItem)

  return array;
}
