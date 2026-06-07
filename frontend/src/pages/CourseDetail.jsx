import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PlayCircle, CheckCircle, User, Clock, Award, FileText, StickyNote, BookOpen } from 'lucide-react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import QuizPanel from '../components/QuizPanel'
import NotesPanel from '../components/NotesPanel'

export default function CourseDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [course, setCourse] = useState(null)
  const [enrolled, setEnrolled] = useState(false)
  const [progress, setProgress] = useState({ completed_lessons: [], progress: 0 })
  const [activeLesson, setActiveLesson] = useState(0)
  const [tab, setTab] = useState('content')

  useEffect(() => {
    if (!id) return
    api.get(`/courses/${id}`).then(res => setCourse(res.data)).catch(() => {})
  }, [id])

  useEffect(() => { if (user) checkEnrollment() }, [user, id])

  const checkEnrollment = async () => {
    try {
      const res = await api.get('/my-courses')
      const myCourse = res.data.find(e => e.course.id === parseInt(id))
      if (myCourse) {
        setEnrolled(true)
        setProgress({ completed_lessons: myCourse.completed_lessons ? myCourse.completed_lessons.split(',').filter(Boolean).map(Number) : [], progress: myCourse.progress })
      }
    } catch (e) {}
  }

  const handleEnroll = async () => {
    if (!user) return window.location.href = '/login'
    await api.post(`/enroll/${id}`)
    setEnrolled(true)
    checkEnrollment()
  }

  const toggleLesson = async (lessonId) => {
    const isCompleted = progress.completed_lessons.includes(lessonId)
    const res = await api.post(`/progress/${id}`, { lesson_id: lessonId, completed: !isCompleted })
    setProgress({ completed_lessons: res.data.completed_lessons, progress: res.data.progress })
  }

  const openCertificate = () => {
    window.open(`http://localhost:8000/certificate/${id}`, '_blank')
  }

  if (!course) return <div className="p-12 text-center">Loading...</div>

  const lesson = course.lessons[activeLesson]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">{course.category}</span>
            <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-4">{course.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1"><User className="w-4 h-4" /> {course.instructor}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.duration}</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">{course.level}</span>
            </div>
          </div>

          {lesson && (
            <div className="mb-8">
              <div className="bg-black rounded-xl aspect-video mb-4 flex items-center justify-center relative overflow-hidden">
                <div className="text-center text-white">
                  <PlayCircle className="w-16 h-16 mx-auto mb-4 opacity-80" />
                  <p className="text-lg font-medium">Video Player</p>
                  <p className="text-sm text-gray-400 mt-1">Lesson {activeLesson + 1}: {lesson.title}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6 prose max-w-none" dangerouslySetInnerHTML={{__html: lesson.content}} />
            </div>
          )}

          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-6">
              {['content', 'notes', 'quiz'].map(t => (
                <button key={t} onClick={() => setTab(t)} className={`pb-3 text-sm font-medium border-b-2 transition-colors ${tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                  {t === 'content' && 'About'}
                  {t === 'notes' && 'Notes'}
                  {t === 'quiz' && 'Quiz'}
                </button>
              ))}
            </div>
          </div>

          {tab === 'content' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4">About this Course</h2>
              <div className="text-gray-600 leading-relaxed prose max-w-none" dangerouslySetInnerHTML={{__html: course.description}}></div>
            </div>
          )}
          {tab === 'notes' && <NotesPanel lessonId={lesson?.id} enrolled={enrolled} />}
          {tab === 'quiz' && <QuizPanel courseId={id} />}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24 space-y-4">
            {!enrolled ? (
              <>
                <div className="text-3xl font-bold text-gray-900 mb-2">Free</div>
                <p className="text-gray-500 text-sm mb-6">Full lifetime access</p>
                <button onClick={handleEnroll} className="w-full btn-primary mb-3">Enroll Now</button>
                <p className="text-xs text-gray-500 text-center">30-Day Money-Back Guarantee</p>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-900">Your Progress</span>
                    <span className="text-blue-600 font-bold">{progress.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-blue-600 h-2.5 rounded-full transition-all" style={{ width: `${progress.progress}%` }} /></div>
                  <p className="text-sm text-gray-500 mt-2">{progress.completed_lessons.length} of {course.lessons.length} lessons completed</p>
                </div>
                {progress.progress === 100 && (
                  <button onClick={openCertificate} className="w-full bg-green-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                    <Award className="w-5 h-5" />
                    Download Certificate
                  </button>
                )}
              </>
            )}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Course Content</h3>
              <div className="space-y-2">
                {course.lessons.map((lesson, idx) => (
                  <div key={lesson.id} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${activeLesson === idx ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'}`} onClick={() => { setActiveLesson(idx); setTab('content') }}>
                    {enrolled && progress.completed_lessons.includes(lesson.id) ? <CheckCircle className="w-5 h-5 text-green-500 shrink-0" /> : <PlayCircle className="w-5 h-5 text-gray-400 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${activeLesson === idx ? 'text-blue-700' : 'text-gray-700'}`}>{idx + 1}. {lesson.title}</p>
                      <p className="text-xs text-gray-500">{lesson.duration}</p>
                    </div>
                    {enrolled && <button onClick={(e) => { e.stopPropagation(); toggleLesson(lesson.id); }} className="text-xs text-blue-600 hover:text-blue-700 font-medium shrink-0">{progress.completed_lessons.includes(lesson.id) ? 'Undo' : 'Done'}</button>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
