import { useState } from 'react'
import { useTasks } from '../hooks/useTasks'
import type { TaskFilters } from '../types'
import QuickAddTask from '../components/tasks/QuickAddTask'
import TaskFiltersBar from '../components/tasks/TaskFilters'
import TaskList from '../components/tasks/TaskList'
import Navbar from '../components/layout/Navbar'
import TaskSummary from '../components/tasks/TaskSummary'
import { authStore } from '../store/authStore'


const TasksPage = () => {
  const [filters, setFilters] = useState<TaskFilters>({})
  const { data: tasks = [], isLoading, isError } = useTasks(filters)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">

        {/* Summary */}
        <TaskSummary
          tasks={tasks}
          username={authStore.getUsername() || 'there'}
        />

        {/* Quick Add */}
        <QuickAddTask />

        {/* Filters + Count */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <TaskFiltersBar filters={filters} onChange={setFilters} />
          <span className="text-sm text-gray-400">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Task List */}
        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </div>
  )
}

export default TasksPage