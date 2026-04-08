export enum TaskStatus {
  Pending = 'Pending',
  InProgress = 'InProgress',
  Completed = 'Completed'
}

export enum TaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High'
}

export interface User {
  username: string
  token: string
  expiresAt: string
}

export interface Task {
  id: number
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTaskRequest {
  title: string
  description?: string
  priority: TaskPriority
  dueDate?: string
}

export interface UpdateTaskRequest {
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
}

export interface AuthResponse {
  token: string
  username: string
  expiresAt: string
}

export interface RegisterRequest {
  username: string
  password: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface UsernameCheckResponse {
  available: boolean
}

export interface TaskFilters {
  status?: TaskStatus
  priority?: TaskPriority
  sortBy?: string
}