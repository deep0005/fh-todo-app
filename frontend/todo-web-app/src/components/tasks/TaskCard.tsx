import { useState, useEffect } from 'react'
import type { Task, UpdateTaskRequest } from '../../types'
import { TaskPriority, TaskStatus } from '../../types'
import { useUpdateTask, useDeleteTask } from '../../hooks/useTasks'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import ConfirmModal from '../ui/ConfirmModal'

interface TaskCardProps {
    task: Task
}



const TaskCard = ({ task }: TaskCardProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editTitle, setEditTitle] = useState(task.title)
    const [editDescription, setEditDescription] = useState(task.description || '')
    const [editPriority, setEditPriority] = useState(task.priority)
    const [editStatus, setEditStatus] = useState(task.status)
    const [editDueDate, setEditDueDate] = useState(
        task.dueDate ? task.dueDate.split('T')[0] : ''
    )
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    useEffect(() => {
        resetEditState()
    }, [task])

    const [saveError, setSaveError] = useState<string | null>(null)
    const updateTask = useUpdateTask()
    const deleteTask = useDeleteTask()

    const handleSave = () => {
        setSaveError(null)
        const data: UpdateTaskRequest = {
            title: editTitle,
            description: editDescription || undefined,
            status: editStatus,
            priority: editPriority,
            dueDate: editDueDate || undefined
        }
        updateTask.mutate(
            { id: task.id, data },
            {
                onSuccess: () => setIsEditing(false),
                onError: (error: any) => {
                    const responseData = error?.response?.data

                    // Handle validation errors object
                    if (responseData?.errors) {
                        const firstError = Object.values(responseData.errors)[0]
                        setSaveError(Array.isArray(firstError) ? firstError[0] : String(firstError))
                        return
                    }

                    // Handle single message error
                    setSaveError(responseData?.message || 'Failed to save task. Please try again.')
                }
            }
        )
    }

    const resetEditState = () => {
        setEditTitle(task.title)
        setEditDescription(task.description || '')
        setEditPriority(task.priority)
        setEditStatus(task.status)
        setEditDueDate(task.dueDate ? task.dueDate.split('T')[0] : '')
    }

    const handleComplete = () => {
        updateTask.mutate({
            id: task.id,
            data: {
                title: task.title,
                description: task.description,
                status: TaskStatus.Completed,
                priority: task.priority,
                dueDate: task.dueDate
            }
        })
    }

    const handleDelete = () => {
        deleteTask.mutate(task.id, {
            onSuccess: () => setShowDeleteModal(false)
        })
    }

    if (isEditing) {
        return (
            <div className="bg-white rounded-xl border border-blue-300 shadow-sm p-4 flex flex-col gap-3">
                <input
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Task title"
                    maxLength={200}
                />
                <p className="text-xs text-gray-400 text-right">{editTitle.length}/200</p>
                <textarea
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Description (optional)"
                    rows={2}
                    maxLength={1000}
                />
                <p className="text-xs text-gray-400 text-right">
                    {editDescription.length}/1000
                </p>
                <div className="flex gap-3 flex-wrap">
                    <select
                        className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as TaskStatus)}
                    >
                        {Object.values(TaskStatus).map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    <select
                        className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        value={editPriority}
                        onChange={(e) => setEditPriority(e.target.value as TaskPriority)}
                    >
                        {Object.values(TaskPriority).map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                    <input
                        type="date"
                        className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                    />
                </div>
                {saveError && (
                    <p className="text-xs text-red-500">{saveError}</p>
                )}
                <div className="flex gap-2 justify-end">
                    <Button variant="secondary" onClick={() => {
                        resetEditState()
                        setSaveError(null)
                        setIsEditing(false)
                    }}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} isLoading={updateTask.isPending}>
                        Save
                    </Button>
                </div>
            </div>
        )
    }

    return (
    <>
        <div className={`bg-white rounded-xl border shadow-sm p-4 flex flex-col gap-2 
          ${task.status === TaskStatus.Completed ? 'opacity-60' : 'border-gray-200'}`}>
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={task.status === TaskStatus.Completed}
                        onChange={handleComplete}
                        className="w-4 h-4 accent-blue-600 cursor-pointer"
                        disabled={task.status === TaskStatus.Completed}
                    />
                    <span className={`text-sm font-medium text-gray-900 
                        ${task.status === TaskStatus.Completed ? 'line-through text-gray-400' : ''}`}>
                        {task.title}
                    </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Badge value={task.status} />
                    <Badge value={task.priority} />
                </div>
            </div>

            {task.description && (
                <p className="text-xs text-gray-500 ml-7">{task.description}</p>
            )}

            <div className="flex items-center justify-between ml-7">
                {task.dueDate && (
                    <span className="text-xs text-gray-400">
                        📅 {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                )}
                <div className="flex gap-2 ml-auto">
                    <button
                        className="text-xs px-3 py-1 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                        onClick={() => setIsEditing(true)}
                    >
                        ✏️ Edit
                    </button>
                    <button
                        className="text-xs px-3 py-1 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                        onClick={() => setShowDeleteModal(true)}
                    >
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </div>

        {/* Modal outside opacity wrapper */}
        {showDeleteModal && (
            <ConfirmModal
                title="Delete Task"
                message={`Are you sure you want to delete "${task.title}"? This cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        )}
    </>
)
}

export default TaskCard