import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function InstructorDashboard() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', category: '', level: 'Beginner', duration: '', image_url: '' })

  useEffect(() => { if (user?.is_instructor) fetchCourses() }, [user])

  const fetchCourses = async () => {
    try {
      const res = await api.get('/instructor/courses')
      setCourses(res.data)
    } catch (e) {}
  }

  const saveCourse = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await api.put(`/instructor/courses/${editing}`, form)
      } else {
        await api.post('/instructor/courses', form)
      }
      setEditing(null)
      setForm({ title: '', description: '', category: '', level: 'Beginner', duration: '', image_url: '' })
      fetchCourses()
    } catch (e) {}
  }

  const editCourse = (c) => {
    setEditing(c.id)
    setForm({ title: c.title, description: c.description, category: c.category, level: c.level, duration: c.duration, image_url: c.image_url || '' })
  }

  const deleteCourse = async (id) => {
    if (!window.confirm('Delete this course?')) return
    await api.delete(`/instructor/courses/${id}`)
    fetchCourses()
  }

  if (!user?.is_instructor) return <div className="p-12 text-center text-gray-500">Instructor access required.</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Instructor Dashboard</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{editing ? 'Edit Course' : 'Create Course'}</h2>
        <form onSubmit={saveCourse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="input-field" placeholder="Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
          <input className="input-field" placeholder="Category" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} required />
          <input className="input-field" placeholder="Duration (e.g. 10 hours)" value={form.duration} onChange={(e) => setForm({...form, duration: e.target.value})} required />
          <select className="input-field" value={form.level} onChange={(e) => setForm({...form, level: e.target.value})}>
            <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
          </select>
          <input className="input-field" placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({...form, image_url: e.target.value})} />
          <div className="md:col-span-2">
            <textarea className="input-field" rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} required />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="btn-primary flex items-center gap-2"><Save className="w-4 h-4" /> {editing ? 'Update' : 'Create'}</button>
            {editing && <button type="button" onClick={() => { setEditing(null); setForm({ title: '', description: '', category: '', level: 'Beginner', duration: '', image_url: '' })}} className="btn-secondary flex items-center gap-2"><X className="w-4 h-4" /> Cancel</button>}
          </div>
        </form>
      </div>
      <div className="space-y-4">
        {courses.map((c) => (
          <div key={c.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">{c.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{c.category} &middot; {c.lessons?.length || 0} lessons</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => editCourse(c)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => deleteCourse(c.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
