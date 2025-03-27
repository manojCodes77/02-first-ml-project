'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Signup() {
    const [formData, setFormData] = useState({ username: '', password: '', email: '', confirmPassword: '' })
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setError(null)
        setMessage(null)
        setLoading(true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to sign up')
            }

            const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formData.email, password: formData.password }),
            });

            if (!loginResponse.ok) {
                const loginErrorData = await loginResponse.json();
                throw new Error(loginErrorData.error || 'Failed to log in');
            }

            const loginData = await loginResponse.json();
            const token = loginData['x-access-token'];
            if (token) {
                localStorage.setItem('Authorization', token);
            } else {
                throw new Error('Token not received');
            }
            
            // now we can redirect to /predictdata page
            window.location.href = '/predictdata';
            const data = await response.json()
            setMessage(data.message)
        } catch (error) {
            console.error('Error:', error)
            setError(error.message || 'An error occurred during signup')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                        <h1 className="text-2xl font-semibold text-center mb-8">Sign Up</h1>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                disabled={loading}
                            >
                                {loading ? 'Signing Up...' : 'Sign Up'}
                            </button>
                        </form>
                        {message && (
                            <div className="mt-6 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                                {message}
                            </div>
                        )}
                        {error && (
                            <div className="mt-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error}
                            </div>
                        )}
                        <div className="mt-6 text-center">
                            <p>
                                Already have an account?{' '}
                                <Link
                                    href="/login"
                                    className="text-blue-600 hover:underline"
                                >
                                    Login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
