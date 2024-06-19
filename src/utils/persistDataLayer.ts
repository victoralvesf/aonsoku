interface IData {
  url: string;
  username: string;
  token: string;
  salt: string;
}

function removeSlashFromUrl(url: string) {
  if (url.slice(-1) === "/") {
    return url.slice(0, -1)
  }

  return url
}

export function getFromLocalStorage() {
  let url = removeSlashFromUrl(localStorage.getItem("server-url") || '')

  const username = localStorage.getItem("server-username")
  const token = localStorage.getItem("server-token")
  const salt = localStorage.getItem("server-salt")

  return {
    url,
    username,
    token,
    salt,
  }
}

export function saveToLocalStorage(data: IData) {
  localStorage.setItem("server-url", removeSlashFromUrl(data.url))
  localStorage.setItem("server-username", data.username)
  localStorage.setItem("server-token", data.token)
  localStorage.setItem("server-salt", data.salt)
}

export function removeFromLocalStorage() {
  localStorage.removeItem("server-url")
  localStorage.removeItem("server-username")
  localStorage.removeItem("server-token")
  localStorage.removeItem("server-salt")
}