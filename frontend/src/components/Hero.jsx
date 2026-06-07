import { Link } from 'react-router-dom'
import { Award, PlayCircle, Star } from 'lucide-react'

export default function Hero() {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-3xl">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">Unlock Your Potential with Expert-Led Courses</h1>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">Learn programming, design, data science, and more from industry professionals.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/courses" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">Explore Courses</Link>
            <Link to="/register" className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors border border-blue-400">Start Free Trial</Link>
          </div>
          <div className="mt-10 flex items-center gap-6 text-sm text-blue-200">
            <span className="flex items-center gap-2"><Award className="w-4 h-4" /> Expert Instructors</span>
            <span className="flex items-center gap-2"><PlayCircle className="w-4 h-4" /> 100+ Hours Content</span>
            <span className="flex items-center gap-2"><Star className="w-4 h-4" /> 4.9/5 Rating</span>
          </div>
        </div>
      </div>
    </div>
  )
}
