import { useState, useRef } from 'react'
import { useLogin, useRegister } from '../hooks/useAuth'
import { useForm } from 'react-hook-form'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { authApi } from '../api/authApi'
import type { LoginRequest, RegisterRequest } from '../types'

const LoginPage = () => {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)

    const login = useLogin()
    const register = useRegister()

    const loginForm = useForm<LoginRequest>()
    const registerForm = useForm<RegisterRequest>()
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const handleLogin = (data: LoginRequest) => {
        login.mutate(data)
    }

    const handleRegister = (data: RegisterRequest) => {
        register.mutate(data)
    }

    const handleUsernameChange = (username: string) => {
        registerForm.setValue('username', username)

        // Clear state when field is empty
        if (!username || username.length === 0) {
            setUsernameAvailable(null)
            if (debounceRef.current) clearTimeout(debounceRef.current)
            return
        }

        setUsernameAvailable(null)

        if (username.length < 3) return

        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(async () => {
            const result = await authApi.checkUsername(username)
            setUsernameAvailable(result.available)
        }, 500)
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">

                {/* Header */}
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Todo App</h1>
                <p className="text-gray-500 text-sm mb-6">Manage your tasks efficiently</p>

                {/* Tabs */}
                <div className="flex border-b mb-6">
                    <button
                        className={`pb-2 px-4 text-sm font-medium transition-colors ${activeTab === 'login'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setActiveTab('login')}
                    >
                        Login
                    </button>
                    <button
                        className={`pb-2 px-4 text-sm font-medium transition-colors ${activeTab === 'register'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setActiveTab('register')}
                    >
                        Register
                    </button>
                </div>

                {/* Login Form */}
                {activeTab === 'login' && (
                    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="flex flex-col gap-4">
                        <Input
                            label="Username"
                            placeholder="Enter your username"
                            error={loginForm.formState.errors.username?.message}
                            {...loginForm.register('username', { required: 'Username is required' })}
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            error={loginForm.formState.errors.password?.message}
                            {...loginForm.register('password', { required: 'Password is required' })}
                        />
                        {login.isError && (
                            <p className="text-sm text-red-500">Invalid username or password</p>
                        )}
                        <Button type="submit" isLoading={login.isPending} className="w-full">
                            Login
                        </Button>
                    </form>
                )}

                {/* Register Form */}
                {activeTab === 'register' && (
                    <form onSubmit={registerForm.handleSubmit(handleRegister)} className="flex flex-col gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Username</label>
                            <div className="relative mt-1">
                                <input
                                    className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 pr-8
        ${registerForm.formState.errors.username ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Choose a username"
                                    {...registerForm.register('username', {
                                        required: 'Username is required',
                                        minLength: { value: 3, message: 'Min 3 characters' },
                                        maxLength: { value: 50, message: 'Max 50 characters' },
                                        onChange: (e) => handleUsernameChange(e.target.value)
                                    })}
                                />
                                {/* Inline tick/cross */}
                                {usernameAvailable === true && (
                                    <p className="text-xs text-green-500 mt-1">✓ Username is available</p>
                                )}
                                {usernameAvailable === false && (
                                    <p className="text-xs text-red-500 mt-1">✗ Username already taken</p>
                                )}
                            </div>
                            {registerForm.formState.errors.username && (
                                <p className="text-xs text-red-500 mt-1">
                                    {registerForm.formState.errors.username.message}
                                </p>
                            )}
                        </div>
                        <Input
                            label="Password"
                            type="password"
                            placeholder="Choose a password"
                            error={registerForm.formState.errors.password?.message}
                            {...registerForm.register('password', {
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Min 6 characters' }
                            })}
                        />
                        {register.isError && (
                            <p className="text-sm text-red-500">Registration failed. Try a different username.</p>
                        )}
                        <Button type="submit" isLoading={register.isPending} className="w-full">
                            Register
                        </Button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default LoginPage