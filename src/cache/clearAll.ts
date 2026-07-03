import { del, keys } from 'idb-keyval'
import { queryClient } from '@/lib/queryClient'
import { queryKeys } from '@/utils/queryKeys'

const IDB_CACHE_PREFIXES = ['lyrics:', 'animated-artwork:']
const IMAGE_CACHE_NAME = 'images'

async function clearIndexedDbCaches() {
  const allKeys = await keys()
  const targeted = allKeys.filter(
    (key): key is string =>
      typeof key === 'string' &&
      IDB_CACHE_PREFIXES.some((prefix) => key.startsWith(prefix)),
  )

  await Promise.all(targeted.map((key) => del(key)))
}

async function clearImageCacheStorage() {
  if (typeof caches === 'undefined') return

  try {
    await caches.delete(IMAGE_CACHE_NAME)
  } catch {}
}

function invalidateInMemoryCaches() {
  queryClient.removeQueries({ queryKey: [queryKeys.song.lyrics] })
  queryClient.removeQueries({ queryKey: [queryKeys.album.animatedArtwork] })
}

export async function clearAllCaches() {
  await Promise.all([clearIndexedDbCaches(), clearImageCacheStorage()])
  invalidateInMemoryCaches()
}
