import { useState } from 'react'
import { useCreateTask } from '../../hooks/useTasks'
import { TaskPriority } from '../../types'

const QuickAddTask = () => {
    const [title, setTitle] = useState('')
    const createTask = useCreateTask()

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && title.trim()) {
            createTask.mutate(
                {
                    title: title.trim(),
                    priority: TaskPriority.Medium
                },
                {
                    onSuccess: () => setTitle('')
                }
            )
        }
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-3">
            <span className="text-gray-400 text-xl">+</span>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What needs to be done? Press Enter to add..."
                className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm"
                disabled={createTask.isPending}
                maxLength={200}
            />
            {title.length > 0 && (
                <span className="text-xs text-gray-400 shrink-0">{title.length}/200</span>
            )}
            {createTask.isPending && (
                <span className="text-xs text-gray-400">Adding...</span>
            )}
        </div>
    )
}

export default QuickAddTask