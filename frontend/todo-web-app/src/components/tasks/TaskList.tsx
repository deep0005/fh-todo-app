import type { Task } from '../../types'
import TaskCard from './TaskCard'

interface TaskListProps {
  tasks: Task[]
  isLoading: boolean
  isError: boolean
}

const TaskList = ({ tasks, isLoading, isError }: TaskListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-gray-400 text-sm">Loading tasks...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-red-500 text-sm">Failed to load tasks. Please try again.</p>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 gap-2">
        <p className="text-4xl">✅</p>
        <p className="text-gray-500 text-sm">No tasks yet. Add one above!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  )
}

export default TaskList