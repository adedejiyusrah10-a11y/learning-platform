import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, PlayCircle, Award, CheckCircle } from 'lucide-react'
import api from '../api/client'
import Hero from '../components/Hero'
import CourseCard from '../components/CourseCard'

export default function Home() {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    api.get('/courses').then(res => setCourses(res.data.slice(0, 4)))
  }, [])

  return (
    <div>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8">
          <div><h2 className="text-3xl font-bold text-gray-900">Featured Courses</h2><p className="text-gray-500 mt-2">Hand-picked by our experts</p></div>
          <Link to="/courses" className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">View All <ChevronRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map(course => <CourseCard key={course.id} course={course} />)}
        </div>
      </div>
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"><PlayCircle className="w-6 h-6 text-blue-600" /></div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Learn by Doing</h3>
              <p className="text-gray-600">Hands-on projects and interactive lessons.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"><Award className="w-6 h-6 text-green-600" /></div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Expert Instructors</h3>
              <p className="text-gray-600">Learn from industry professionals.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-6 h-6 text-purple-600" /></div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Track Progress</h3>
              <p className="text-gray-600">Monitor your learning journey.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
