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