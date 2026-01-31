export async function getCachedImage(url: string): Promise<string> {
  try {
    const cache = await caches.open('images')

    const cachedResponse = await cache.match(url)

    if (cachedResponse) {
      const blob = await cachedResponse.blob()

      return URL.createObjectURL(blob)
    }

    const networkResponse = await fetch(url)

    if (!networkResponse.ok) {
      return url
    }

    await cache.put(url, networkResponse.clone())
    const blob = await networkResponse.blob()

    return URL.createObjectURL(blob)
  } catch (error) {
    console.error('Error fetching image:', error)

    return url
  }
}
