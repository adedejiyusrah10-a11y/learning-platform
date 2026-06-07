import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import api from '../api/client'
import CourseCard from '../components/CourseCard'

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data))
    fetchCourses()
  }, [])

  const fetchCourses = (cat = '', q = '') => {
    setLoading(true)
    api.get('/courses', { params: { category: cat, search: q } }).then(res => { setCourses(res.data); setLoading(false) })
  }

  const handleSearch = (e) => { e.preventDefault(); fetchCourses(category, search) }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">All Courses</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Search courses..." className="input-field pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </form>
          <select className="input-field md:w-48" value={category} onChange={(e) => { setCategory(e.target.value); fetchCourses(e.target.value, search) }}>
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="card animate-pulse"><div className="h-48 bg-gray-200"></div><div className="p-5 space-y-3"><div className="h-4 bg-gray-200 rounded w-1/4"></div><div className="h-6 bg-gray-200 rounded"></div><div className="h-4 bg-gray-200 rounded w-3/4"></div></div></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => <CourseCard key={course.id} course={course} />)}
        </div>
      )}
    </div>
  )
}
