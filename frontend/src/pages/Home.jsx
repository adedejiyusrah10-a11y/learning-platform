import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, PlayCircle, Award, CheckCircle, BookOpen, BarChart3, Sparkles } from 'lucide-react'
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Why Learn with Lumora?</h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">Everything you need to accelerate your learning journey</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            { icon: BookOpen, title: 'Structured Curriculum', desc: 'Well-organized courses designed to take you from beginner to proficient step by step.', color: 'from-blue-400 to-blue-600', bg: 'bg-blue-50' },
            { icon: PlayCircle, title: 'Interactive Content', desc: 'Video lessons, quizzes, and hands-on projects that make learning engaging and effective.', color: 'from-purple-400 to-purple-600', bg: 'bg-purple-50' },
            { icon: BarChart3, title: 'Track Your Progress', desc: 'Monitor your completion rate, scores, and achievements as you advance through courses.', color: 'from-green-400 to-green-600', bg: 'bg-green-50' },
          ].map((item, i) => (
            <div key={i} className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Featured Courses</h2>
            <p className="text-gray-500 mt-2">Hand-picked by our experts to get you started</p>
          </div>
          <Link to="/courses" className="text-purple-600 font-semibold hover:text-purple-700 flex items-center gap-1 group">
            View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map(course => <CourseCard key={course.id} course={course} />)}
        </div>
      </div>
      <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Start Your Learning Journey Today
              </h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Join thousands of learners who are advancing their careers with Lumora.
                Get unlimited access to all courses, quizzes, and certificates.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3.5 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/25">
                  Get Started Free <Sparkles className="w-5 h-5" />
                </Link>
                <Link to="/courses" className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/10">
                  Browse Courses
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Award, stat: '4.9', label: 'Avg Rating' },
                { icon: CheckCircle, stat: '50+', label: 'Courses' },
                { icon: PlayCircle, stat: '10K+', label: 'Learners' },
                { icon: Sparkles, stat: '100%', label: 'Free to Start' },
              ].map((item, i) => (
                <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-5 text-center border border-white/10">
                  <item.icon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{item.stat}</div>
                  <div className="text-sm text-gray-400">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
