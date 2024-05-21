interface IData {
  url: string;
  username: string;
  token: string;
  salt: string;
}

export function saveToLocalStorage(data: IData) {
  localStorage.setItem("server-url", data.url)
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