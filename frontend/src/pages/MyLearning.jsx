import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import api from '../api/client'
import CourseCard from '../components/CourseCard'

export default function MyLearning() {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/my-courses').then(res => { setEnrollments(res.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-12 text-center">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Learning</h1>
      {enrollments.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No courses yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Start learning by enrolling in a course</p>
          <Link to="/courses" className="btn-primary">Browse Courses</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map(enrollment => <CourseCard key={enrollment.id} course={enrollment.course} enrolled={true} progress={enrollment.progress} />)}
        </div>
      )}
    </div>
  )
}
