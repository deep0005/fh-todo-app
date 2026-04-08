import { TaskPriority, TaskStatus } from '../../types'

interface BadgeProps {
  value: TaskStatus | TaskPriority
}

const statusStyles: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  InProgress: 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
  Low: 'bg-gray-100 text-gray-800',
  Medium: 'bg-orange-100 text-orange-800',
  High: 'bg-red-100 text-red-800'
}

const Badge = ({ value }: BadgeProps) => {
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyles[value] || 'bg-gray-100 text-gray-800'}`}>
      {value}
    </span>
  )
}

export default Badge