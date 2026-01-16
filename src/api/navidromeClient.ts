import { useAppStore } from '@/store/app.store'
import { AuthType } from '@/types/serverConfig'
import { genPasswordToken, genEncodedPassword } from '@/utils/salt'

export interface LoginResponse {
  id: string
  name: string
  username: string
  isAdmin: boolean
  token: string
}

export interface UserData {
  id: string
  name: string
  username: string
  email: string
  isAdmin: boolean
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
}

class NavidromeNativeApi {
  private getServerUrl(): string {
    return useAppStore.getState().data.url
  }

  private async getCurrentCredentials(): Promise<{ username: string; password: string }> {
    const state = useAppStore.getState().data
    return {
      username: state.username,
      password: state.password
    }
  }

  // (riddlah) TODO!!! Save token to store and fetch it if present.

  async getAuthToken(): Promise<string | null> {

    try {
      const { username, password } = await this.getCurrentCredentials()
      const serverUrl = this.getServerUrl()

      if (!username || !password) {
        throw new Error('userParams.error.userDataNotSet')
      }

      const response = await fetch(`${serverUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        throw new Error('userParams.error.authError', response.status)
      }

      const data: LoginResponse = await response.json()
      return data.token
    } catch (error) {
      console.error('userParams.error.tokenFetchError', error)
      return null
    }
  }

  private async makeAuthorizedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const serverUrl = this.getServerUrl()
    const token = await this.getAuthToken()

    if (!token) {
      throw new Error('userParams.error.tokenFetchError')
    }

    const response = await fetch(`${serverUrl}/api/${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-ND-Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API Error ${response.status}`)
    }

    return response.json()
  }

  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<ApiResponse<UserData>> {
    try {
      const { username } = await this.getCurrentCredentials()
      const serverUrl = this.getServerUrl()

      if (!username || !oldPassword) {
        return {
          success: false,
          message: 'userParams.error.userDataNotSet',
        }
      }

      const loginResponse = await fetch(`${serverUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password: oldPassword }),
      })

      if (!loginResponse.ok) {
        return {
          success: false,
          message: 'userParams.error.wrongOldPassword',
        }
      }

      const loginData: LoginResponse = await loginResponse.json()
      console.log(loginData)
      const { id, token } = loginData

      const updateResponse = await fetch(`${serverUrl}/api/user/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-ND-Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: oldPassword,
          password: newPassword,
          changePassword: true,
        }),
      })

      console.log(updateResponse)

      if (!updateResponse.ok) {
        return {
          success: false,
          message: 'userParams.error.passwordChangeFailed',
        }
      }

      const userData: UserData = await updateResponse.json()

      // (riddlah): Saving password to store replacing the old
      const state = useAppStore.getState()
      const { authType } = state.data
      let encodedPassword: string

      if (authType === AuthType.TOKEN) {
        encodedPassword = genPasswordToken(newPassword)
      } else if (authType === AuthType.PASSWORD) {
        encodedPassword = genEncodedPassword(newPassword)
      }
      else {
        encodedPassword = genPasswordToken(newPassword)
      }
      state.actions.setPassword(encodedPassword)

      return {
        success: true,
        message: 'userParams.error.passwordChangeSuccess',
        data: userData,
      }
    } catch (error) {
      console.error('userParams.error.passwordChangeFailed', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'userParams.error.unknownError',
      }
    }
  }

  async getCurrentUser(): Promise<ApiResponse<UserData>> {
    try {
      const token = await this.getAuthToken()
      if (!token) {
        return {
          success: false,
          message: 'userParams.error.tokenFetchError',
        }
      }

      const serverUrl = this.getServerUrl()
      const response = await fetch(`${serverUrl}/api/user/current`, {
        headers: {
          'Content-Type': 'application/json',
          'X-ND-Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        return {
          success: false,
          message: 'userParams.error.userFetchError',
        }
      }

      const data: UserData = await response.json()
      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'userParams.error.unknownError',
      }
    }
  }

  async updateUser(updates: Partial<{
    name: string
    email: string
    password: string
  }>): Promise<ApiResponse<UserData>> {
    try {
      const token = await this.getAuthToken()
      if (!token) {
        return {
          success: false,
          message: 'userParams.error.tokenFetchError',
        }
      }

      const currentUser = await this.getCurrentUser()
      if (!currentUser.success || !currentUser.data) {
        return {
          success: false,
          message: 'userParams.error.tokenFetchError',
        }
      }

      const serverUrl = this.getServerUrl()
      const response = await fetch(`${serverUrl}/api/user/${currentUser.data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-ND-Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        return {
          success: false,
          message: 'userParams.error.dataUpdateFailed',
        }
      }

      const data: UserData = await response.json()

      if (updates.password) {
        useAppStore.getState().updateData({ password: updates.password })
      }

      return {
        success: true,
        message: 'userParams.error.dataUpdateSuccess',
        data,
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'userParams.error.unknownError',
      }
    }
  }

  async checkAuth(): Promise<boolean> {
    try {
      const token = await this.getAuthToken()
      if (!token) return false

        const user = await this.getCurrentUser()
        return user.success
    } catch {
      return false
    }
  }
}

export const navidromeNativeApi = new NavidromeNativeApi()

export const changePassword = navidromeNativeApi.changePassword.bind(navidromeNativeApi)
export const getCurrentUser = navidromeNativeApi.getCurrentUser.bind(navidromeNativeApi)
export const updateUser = navidromeNativeApi.updateUser.bind(navidromeNativeApi)
export const checkAuth = navidromeNativeApi.checkAuth.bind(navidromeNativeApi)
