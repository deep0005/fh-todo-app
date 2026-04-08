import { useLogout } from '../../hooks/useAuth'
import { authStore } from '../../store/authStore'
import Button from '../ui/Button'

const Navbar = () => {
  const logout = useLogout()

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-gray-900">📋 Todo App</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          👤 {authStore.getUsername()}
        </span>
        <Button variant="secondary" onClick={logout}>
          Logout
        </Button>
      </div>
    </nav>
  )
}

export default Navbar