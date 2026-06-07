import { Link } from 'react-router-dom'
import { User, Clock } from 'lucide-react'

export default function CourseCard({ course, enrolled = false, progress = 0 }) {
  return (
    <div className="card group">
      <div className="relative h-48 overflow-hidden">
        <img src={course.image_url || `https://placehold.co/800x600/3b82f6/ffffff?text=${encodeURIComponent(course.title)}`} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { e.target.src = `https://placehold.co/800x600/3b82f6/ffffff?text=${encodeURIComponent(course.title)}` }} />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-semibold text-gray-700">{course.level}</div>
      </div>
      <div className="p-5">
        <div className="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wide">{course.category}</div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1"><User className="w-4 h-4" /> {course.instructor}</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.duration}</span>
        </div>
        {enrolled ? (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-700">{progress}% Complete</span>
              <span className="text-gray-500">{progress === 100 ? 'Done!' : 'In Progress'}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} /></div>
          </div>
        ) : (
          <Link to={`/courses/${course.id}`} className="block w-full text-center btn-primary">View Details</Link>
        )}
      </div>
    </div>
  )
}
