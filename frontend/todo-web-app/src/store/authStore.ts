import { tokenUtils } from '../utils/token'

// Simple reactive store without external library
let _username: string | null = tokenUtils.getUsername()
let _token: string | null = tokenUtils.getToken()

export const authStore = {
  getUsername: (): string | null => _username,
  getToken: (): string | null => _token,
  isAuthenticated: (): boolean => !!_token,

  setAuth: (token: string, username: string): void => {
    _token = token
    _username = username
    tokenUtils.setToken(token)
    tokenUtils.setUsername(username)
  },

  clearAuth: (): void => {
    _token = null
    _username = null
    tokenUtils.clear()
  }
}