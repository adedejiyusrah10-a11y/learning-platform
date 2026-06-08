import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Save } from 'lucide-react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ full_name: '', email: '', password: '' })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!user) navigate('/login')
    if (user) setForm({ full_name: user.full_name, email: user.email, password: '' })
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await api.put('/me', form)
      setUser(res.data)
      setMessage('Profile updated!')
    } catch (err) {
      setMessage('Error updating profile')
    }
    setSaving(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.full_name}</h1>
            <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>
        {message && (
          <div className={`p-3 rounded-lg text-sm mb-4 ${message.includes('Error') ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input type="text" required className="input-field" value={form.full_name} onChange={(e) => setForm({...form, full_name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input type="email" required className="input-field" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password (leave blank to keep current)</label>
            <input type="password" className="input-field" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} />
          </div>
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
