import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BookOpen, LayoutDashboard, Shield, LogOut, Menu, X } from 'lucide-react'
import DarkModeToggle from './DarkModeToggle'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 dark:bg-gray-900 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1.5 rounded-lg"><BookOpen className="w-6 h-6 text-white" /></div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Lumora</span>
            </Link>
            <div className="hidden md:flex items-center ml-10 gap-6">
              <Link to="/courses" className="text-gray-600 hover:text-gray-900 font-medium dark:text-gray-300 dark:hover:text-white">Courses</Link>
              {user && (
                <Link to="/my-learning" className="text-gray-600 hover:text-gray-900 font-medium dark:text-gray-300 dark:hover:text-white">My Learning</Link>
              )}
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <DarkModeToggle />
            {user ? (
              <div className="flex items-center gap-3">
                {user.is_instructor && (
                  <>
                    <Link to="/instructor" className="text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"><LayoutDashboard className="w-5 h-5" /></Link>
                    <Link to="/admin" className="text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"><Shield className="w-5 h-5" /></Link>
                  </>
                )}
                <Link to="/profile" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">{user.full_name}</Link>
                <button onClick={logout} className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"><LogOut className="w-5 h-5" /></button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium dark:text-gray-300 dark:hover:text-white">Sign In</Link>
                <Link to="/register" className="btn-primary">Get Started</Link>
              </div>
            )}
          </div>
          <div className="md:hidden flex items-center gap-2">
            <DarkModeToggle />
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 dark:text-gray-300">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-3 dark:bg-gray-900 dark:border-gray-800">
          <Link to="/courses" className="block text-gray-600 dark:text-gray-300 font-medium" onClick={() => setIsOpen(false)}>Courses</Link>
          {user ? (
            <>
              <Link to="/my-learning" className="block text-gray-600 dark:text-gray-300 font-medium" onClick={() => setIsOpen(false)}>My Learning</Link>
              <Link to="/profile" className="block text-gray-600 dark:text-gray-300 font-medium" onClick={() => setIsOpen(false)}>Profile</Link>
              <button onClick={() => { logout(); setIsOpen(false); }} className="block text-red-600 font-medium">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-gray-600 dark:text-gray-300 font-medium" onClick={() => setIsOpen(false)}>Sign In</Link>
              <Link to="/register" className="block text-blue-600 font-medium" onClick={() => setIsOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
