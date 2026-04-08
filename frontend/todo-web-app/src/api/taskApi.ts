import apiClient from './axios'
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskFilters
} from '../types'

export const tasksApi = {
  getAll: async (filters: TaskFilters): Promise<Task[]> => {
    const response = await apiClient.get<Task[]>('/tasks', { params: filters })
    return response.data
  },

  getById: async (id: number): Promise<Task> => {
    const response = await apiClient.get<Task>(`/tasks/${id}`)
    return response.data
  },

  create: async (data: CreateTaskRequest): Promise<Task> => {
    const response = await apiClient.post<Task>('/tasks', data)
    return response.data
  },

  update: async (id: number, data: UpdateTaskRequest): Promise<Task> => {
    const response = await apiClient.put<Task>(`/tasks/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`)
  }
}