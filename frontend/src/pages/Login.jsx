import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try { await login(email, password); navigate('/') } catch (err) { setError('Invalid email or password') }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"><BookOpen className="w-6 h-6 text-white" /></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Sign in to continue learning</p>
        </div>
        {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label><input type="email" required className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label><input type="password" required className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <button type="submit" className="w-full btn-primary">Sign In</button>
        </form>
        <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">Don't have an account? <Link to="/register" className="text-blue-600 dark:text-purple-400 font-medium hover:text-blue-700 dark:hover:text-purple-300">Sign up</Link></p>
      </div>
    </div>
  )
}
