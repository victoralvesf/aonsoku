import { MD5 } from 'crypto-js'
import { AuthType } from '@/types/serverConfig'

export const saltWord = '40n50kuPl4y3r'

const { SERVER_URL, HIDE_SERVER, APP_USER, APP_PASSWORD, APP_AUTH_TYPE } =
  window

export const hasValidConfig = Boolean(
  SERVER_URL && HIDE_SERVER && APP_USER && APP_PASSWORD && APP_AUTH_TYPE,
)

export function getAuthType() {
  if (!hasValidConfig) return AuthType.TOKEN

  if (APP_AUTH_TYPE === 'token') return AuthType.TOKEN
  if (APP_AUTH_TYPE === 'password') return AuthType.PASSWORD

  return AuthType.TOKEN
}

export function genUser() {
  if (!hasValidConfig) return ''

  return APP_USER as string
}

export function genPassword() {
  if (!hasValidConfig) return ''

  const authType = getAuthType()
  const password = APP_PASSWORD as string

  if (authType === AuthType.TOKEN) return genPasswordToken(password)
  if (authType === AuthType.PASSWORD) return genEncodedPassword(password)

  return ''
}

export function genPasswordToken(password: string) {
  return MD5(`${password}${saltWord}`).toString()
}

export function genEncodedPassword(password: string) {
  return `enc:${toHex(password)}`
}

export function toHex(s: string) {
  return s
    .split('')
    .map((c) => c.charCodeAt(0).toString(16))
    .join('')
}
