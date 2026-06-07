import React, { useState, useEffect } from 'react'
import { Save, StickyNote } from 'lucide-react'
import api from '../api/client'

export default function NotesPanel({ lessonId, enrolled }) {
  const [content, setContent] = useState('')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!lessonId || !enrolled) return
    api.get(`/notes/${lessonId}`).then(res => {
      if (res.data && res.data.content) {
        setContent(res.data.content)
      }
    }).catch(() => {})
  }, [lessonId, enrolled])

  const saveNote = async () => {
    if (!content.trim()) {
      setError('Note cannot be empty')
      setTimeout(() => setError(''), 2000)
      return
    }
    setError('')
    await api.post(`/notes/${lessonId}`, { content })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!enrolled) return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Your Notes</h3>
        </div>
        <button onClick={saveNote} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${saved ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save'}
        </button>
      </div>
      {error && <div className="bg-red-50 text-red-600 p-2 rounded-lg text-sm mb-3">{error}</div>}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Take notes on this lesson..."
        className="w-full h-32 p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
      />
    </div>
  )
}
