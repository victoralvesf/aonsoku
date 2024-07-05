export function removeSlashFromUrl(url: string) {
  if (url.slice(-1) === '/') {
    return url.slice(0, -1)
  }

  return url
}
