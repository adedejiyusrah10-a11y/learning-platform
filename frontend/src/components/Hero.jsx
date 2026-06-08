import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Users, Award, Shield } from 'lucide-react'

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-3xl opacity-10"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm text-purple-200 mb-6 border border-white/10">
              <Shield className="w-4 h-4" /> Trusted by 10,000+ learners
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight text-white">
              Master New Skills{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">with Confidence</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-xl">
              Lumora brings you expert-led courses in programming, design, data science, and more.
              Learn at your own pace, track your progress, and earn certificates.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/courses" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3.5 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/25">
                Explore Courses <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/register" className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/10">
                Get Started Free
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-sm text-gray-400 mt-1">Expert Courses</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-sm text-gray-400 mt-1">Active Learners</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">4.9</div>
                <div className="text-sm text-gray-400 mt-1">Avg Rating</div>
              </div>
            </div>
          </div>
          <div className="hidden lg:block relative">
            <div className="relative">
              <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: BookOpen, label: 'Programming', color: 'from-blue-400 to-blue-600', count: '12 Courses' },
                    { icon: Users, label: 'Data Science', color: 'from-green-400 to-green-600', count: '8 Courses' },
                    { icon: Award, label: 'Design', color: 'from-yellow-400 to-yellow-600', count: '6 Courses' },
                    { icon: Shield, label: 'Web Dev', color: 'from-purple-400 to-purple-600', count: '10 Courses' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/10 rounded-xl p-4 hover:bg-white/20 transition-colors">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-white font-semibold text-sm">{item.label}</div>
                      <div className="text-gray-400 text-xs mt-1">{item.count}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl px-6 py-4 shadow-xl">
                <div className="text-white text-sm font-semibold">🎉 New: React Masterclass</div>
                <div className="text-purple-200 text-xs mt-1">Enroll now — limited spots</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
