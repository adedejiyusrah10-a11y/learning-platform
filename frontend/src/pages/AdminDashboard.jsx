import React, { useState, useEffect } from 'react'
import { User, Shield } from 'lucide-react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [courses, setCourses] = useState([])

  useEffect(() => {
    if (user?.is_instructor) {
      api.get('/admin/users').then(res => setUsers(res.data)).catch(() => {})
      api.get('/courses').then(res => setCourses(res.data)).catch(() => {})
    }
  }, [user])

  if (!user?.is_instructor) return <div className="p-12 text-center text-gray-500">Admin access required.</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Admin Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{users.length}</div>
          <div className="text-gray-500 dark:text-gray-400 mt-1">Total Users</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{courses.length}</div>
          <div className="text-gray-500 dark:text-gray-400 mt-1">Total Courses</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{users.filter(u => u.is_instructor).length}</div>
          <div className="text-gray-500 dark:text-gray-400 mt-1">Instructors</div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><User className="w-5 h-5" /> Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Name</th>
                <th className="pb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Email</th>
                <th className="pb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-100 dark:border-gray-700/50">
                  <td className="py-3 text-sm text-gray-900 dark:text-white">{u.full_name}</td>
                  <td className="py-3 text-sm text-gray-600 dark:text-gray-400">{u.email}</td>
                  <td className="py-3 text-sm">{u.is_instructor ? <span className="flex items-center gap-1 text-purple-600"><Shield className="w-4 h-4" /> Instructor</span> : <span className="text-gray-500">Student</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
