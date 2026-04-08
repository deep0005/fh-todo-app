import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateTaskRequest, UpdateTaskRequest, TaskFilters } from '../types'
import { tasksApi } from '../api/taskApi'

const TASKS_KEY = 'tasks'

export const useTasks = (filters: TaskFilters) => {
  return useQuery({
    queryKey: [TASKS_KEY, filters],
    queryFn: () => tasksApi.getAll(filters)
  })
}

export const useCreateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTaskRequest) => tasksApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] })
    }
  })
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaskRequest }) =>
      tasksApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] })
    }
  })
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => tasksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] })
    }
  })
}