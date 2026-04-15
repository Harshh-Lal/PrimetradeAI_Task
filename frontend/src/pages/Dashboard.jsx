import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ title: '', description: '' })
  const [creating, setCreating] = useState(false)
  const [formError, setFormError] = useState('')

  const fetchTasks = async () => {
    try {
      const endpoint = user.role === 'ADMIN' ? '/admin/tasks' : '/tasks'
      const res = await api.get(endpoint)
      setTasks(res.data.tasks)
    } catch (err) {
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTasks() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    setFormError('')
    try {
      await api.post('/tasks', form)
      setForm({ title: '', description: '' })
      fetchTasks()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create task')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`)
      setTasks(tasks.filter(t => t.id !== id))
    } catch (err) {
      alert('Failed to delete task')
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/tasks/${id}`, { status })
      fetchTasks()
    } catch (err) {
      alert('Failed to update task')
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const statusColor = {
    PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    IN_PROGRESS: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    COMPLETED: 'bg-green-500/10 text-green-400 border-green-500/30',
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">Primetrade</h1>
          <p className="text-xs text-gray-500">Task Manager</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-white">{user.name}</p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Create Task Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
          <h2 className="text-base font-semibold text-white mb-4">Create New Task</h2>
          {formError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
              {formError}
            </div>
          )}
          <form onSubmit={handleCreate} className="space-y-3">
            <input
              type="text"
              placeholder="Task title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#645CAA]"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#645CAA]"
            />
            <button
              type="submit"
              disabled={creating}
              className="bg-[#7a72ca] hover:bg-[#645CAA] disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              {creating ? 'Adding...' : '+ Add Task'}
            </button>
          </form>
        </div>

        {/* Task List */}
        <h2 className="text-base font-semibold text-white mb-4">
          {user.role === 'ADMIN' ? 'All System Tasks' : 'Your Tasks'}{' '}
          <span className="text-gray-500 font-normal text-sm">({tasks.length})</span>
        </h2>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading tasks...</p>
        ) : error ? (
          <p className="text-red-400 text-sm">{error}</p>
        ) : tasks.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <p className="text-gray-500 text-sm">No tasks yet. Create your first one above!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white text-sm font-medium truncate">{task.title}</p>
                    {user.role === 'ADMIN' && task.user && (
                      <span className="bg-gray-800 text-gray-400 text-[10px] px-2 py-0.5 rounded border border-gray-700">
                        {task.user.name}
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <p className="text-gray-500 text-xs mt-0.5 truncate">{task.description}</p>
                  )}
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColor[task.status] || 'bg-gray-700 text-gray-400'}`}>
                      {task.status || 'PENDING'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={task.status || 'PENDING'}
                    onChange={e => handleStatusChange(task.id, e.target.value)}
                    className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-gray-600 hover:text-red-400 text-xs border border-gray-700 hover:border-red-500/30 px-2 py-1.5 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}