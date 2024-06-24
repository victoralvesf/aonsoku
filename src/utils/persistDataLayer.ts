interface IData {
  url: string
  username: string
  token: string
}

function removeSlashFromUrl(url: string) {
  if (url.slice(-1) === '/') {
    return url.slice(0, -1)
  }

  return url
}

export function getFromLocalStorage() {
  const url = removeSlashFromUrl(localStorage.getItem('server-url') || '')

  const username = localStorage.getItem('server-username')
  const token = localStorage.getItem('server-token')

  return {
    url,
    username,
    token,
  }
}

export function saveToLocalStorage(data: IData) {
  localStorage.setItem('server-url', removeSlashFromUrl(data.url))
  localStorage.setItem('server-username', data.username)
  localStorage.setItem('server-token', data.token)
}

export function removeFromLocalStorage() {
  localStorage.removeItem('server-url')
  localStorage.removeItem('server-username')
  localStorage.removeItem('server-token')
}
