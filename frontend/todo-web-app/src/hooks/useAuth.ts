import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api/authApi'
import { authStore } from '../store/authStore'
import type { LoginRequest, RegisterRequest } from '../types'
import { useNavigate } from 'react-router-dom'

export const useLogin = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      authStore.setAuth(response.token, response.username)
      navigate('/tasks')
    }
  })
}

export const useRegister = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (response) => {
      authStore.setAuth(response.token, response.username)
      navigate('/tasks')
    }
  })
}

export const useLogout = () => {
  const navigate = useNavigate()

  return () => {
    authStore.clearAuth()
    navigate('/login')
  }
}