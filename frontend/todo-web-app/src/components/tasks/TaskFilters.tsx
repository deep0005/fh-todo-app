import type { TaskFilters } from '../../types'
import { TaskPriority, TaskStatus } from '../../types'

interface TaskFiltersProps {
    filters: TaskFilters
    onChange: (filters: TaskFilters) => void
}

const TaskFiltersBar = ({ filters, onChange }: TaskFiltersProps) => {
    return (
        <div className="flex flex-wrap gap-3 items-center">
            {/* Status Filter */}
            <select
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={filters.status || ''}
                onChange={(e) => onChange({
                    ...filters,
                    status: e.target.value as TaskStatus || undefined
                })}
            >
                <option value="">All Statuses</option>
                {Object.values(TaskStatus).map(s => (
                    <option key={s} value={s}>{s}</option>
                ))}
            </select>

            {/* Priority Filter */}
            <select
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={filters.priority || ''}
                onChange={(e) => onChange({
                    ...filters,
                    priority: e.target.value as TaskPriority || undefined
                })}
            >
                <option value="">All Priorities</option>
                {Object.values(TaskPriority).map(p => (
                    <option key={p} value={p}>{p}</option>
                ))}
            </select>

            {/* Sort */}
            <select
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={filters.sortBy || ''}
                onChange={(e) => onChange({
                    ...filters,
                    sortBy: e.target.value || undefined
                })}
            >
                <option value="">Sort: Latest</option>
                <option value="duedate_asc">Due Date: Earliest First</option>
                <option value="duedate_desc">Due Date: Latest First</option>
                <option value="priority_asc">Priority: Low to High</option>
                <option value="priority_desc">Priority: High to Low</option>
            </select>

            {/* Clear Filters */}
            {(filters.status || filters.priority || filters.sortBy) && (
                <button
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={() => onChange({})}
                >
                    Clear filters
                </button>
            )}
        </div>
    )
}

export default TaskFiltersBar