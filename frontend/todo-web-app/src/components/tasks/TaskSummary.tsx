import type { Task } from '../../types'
import { TaskStatus } from '../../types'

interface TaskSummaryProps {
  tasks: Task[]
  username: string
}

const TaskSummary = ({ tasks, username }: TaskSummaryProps) => {
  const total = tasks.length
  const completed = tasks.filter(t => t.status === TaskStatus.Completed).length
  const inProgress = tasks.filter(t => t.status === TaskStatus.InProgress).length
  const pending = tasks.filter(t => t.status === TaskStatus.Pending).length
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4">
      
      {/* Greeting */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          {getGreeting()}, {username} 👋
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {total === 0
            ? "You have no tasks yet. Add one below!"
            : completed === total
            ? "All tasks completed. Great work! 🎉"
            : `You have ${total - completed} task${total - completed !== 1 ? 's' : ''} remaining.`}
        </p>
      </div>

      {/* Progress Bar */}
      {total > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>{completed} of {total} completed</span>
            <span>{percentage}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Stats */}
      {total > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-yellow-600">{pending}</p>
            <p className="text-xs text-yellow-700 mt-1">Pending</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-blue-600">{inProgress}</p>
            <p className="text-xs text-blue-700 mt-1">In Progress</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-green-600">{completed}</p>
            <p className="text-xs text-green-700 mt-1">Completed</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskSummary