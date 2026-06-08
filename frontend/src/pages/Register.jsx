import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', fullName: '' })
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try { await register(form.email, form.password, form.fullName); navigate('/login') } catch (err) { setError('Email already registered or invalid data') }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Start your learning journey</p>
        </div>
        {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label><input type="text" required className="input-field" value={form.fullName} onChange={(e) => setForm({...form, fullName: e.target.value})} /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label><input type="email" required className="input-field" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label><input type="password" required minLength={6} className="input-field" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} /></div>
          <button type="submit" className="w-full btn-primary">Create Account</button>
        </form>
        <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">Already have an account? <Link to="/login" className="text-blue-600 dark:text-purple-400 font-medium hover:text-blue-700 dark:hover:text-purple-300">Sign in</Link></p>
      </div>
    </div>
  )
}
