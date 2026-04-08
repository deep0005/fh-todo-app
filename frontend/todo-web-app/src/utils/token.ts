const TOKEN_KEY = 'todo_token'
const USERNAME_KEY = 'todo_username'

export const tokenUtils = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  removeToken: (): void => localStorage.removeItem(TOKEN_KEY),
  getUsername: (): string | null => localStorage.getItem(USERNAME_KEY),
  setUsername: (username: string): void => localStorage.setItem(USERNAME_KEY, username),
  removeUsername: (): void => localStorage.removeItem(USERNAME_KEY),
  clear: (): void => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USERNAME_KEY)
  }
}