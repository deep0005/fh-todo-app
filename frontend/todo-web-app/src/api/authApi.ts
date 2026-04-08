import type { AuthResponse, LoginRequest, RegisterRequest, UsernameCheckResponse } from '../types'
import apiClient from './axios'


export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
        type NewType = AuthResponse

    const response = await apiClient.post<NewType>('/auth/register', data)
    return response.data
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data)
    return response.data
  },

  checkUsername: async (username: string): Promise<UsernameCheckResponse> => {
    const response = await apiClient.get<UsernameCheckResponse>(
      `/auth/check-username/${username}`
    )
    return response.data
  }
}