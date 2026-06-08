import React, { useState } from 'react'
import { Award, CheckCircle, XCircle } from 'lucide-react'
import api from '../api/client'

export default function QuizPanel({ courseId }) {
  const [quizzes, setQuizzes] = useState([])
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)

  const loadQuizzes = async () => {
    const res = await api.get(`/courses/${courseId}/quizzes`)
    setQuizzes(res.data)
    setShowQuiz(true)
  }

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz)
    setAnswers({})
    setResult(null)
  }

  const submitQuiz = async () => {
    setLoading(true)
    const answerList = activeQuiz.questions.map(q => answers[q.id] ?? -1)
    const res = await api.post(`/quizzes/${activeQuiz.id}/submit`, answerList)
    setResult(res.data)
    setLoading(false)
  }

  const allAnswered = activeQuiz && activeQuiz.questions.every(q => answers[q.id] !== undefined)

  if (!showQuiz) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-6 h-6 text-yellow-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Practice Quiz</h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Test your knowledge with course quizzes.</p>
        <button onClick={loadQuizzes} className="btn-primary w-full">Start Quiz</button>
      </div>
    )
  }

  if (result) {
    const passed = result.percentage >= 60
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center">
          {passed ? <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" /> : <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{passed ? 'Great job!' : 'Keep practicing!'}</h3>
          <div className="text-4xl font-bold text-blue-600 dark:text-purple-400 mb-2">{result.percentage}%</div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{result.score} of {result.total} correct</p>
          <div className="flex gap-3">
            <button onClick={() => { setActiveQuiz(null); setResult(null); loadQuizzes() }} className="flex-1 btn-secondary">Try Again</button>
            <button onClick={() => setShowQuiz(false)} className="flex-1 btn-secondary">Close</button>
          </div>
        </div>
      </div>
    )
  }

  if (activeQuiz) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{activeQuiz.title}</h3>
        <div className="space-y-6">
          {activeQuiz.questions.map((q, qi) => (
            <div key={q.id}>
              <p className="font-medium text-gray-900 dark:text-white mb-3">{qi + 1}. {q.question}</p>
              <div className="space-y-2">
                {JSON.parse(q.options).map((opt, oi) => (
                  <label key={oi} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${answers[q.id] === oi ? 'border-blue-500 dark:border-purple-500 bg-blue-50 dark:bg-purple-900/30' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                    <input type="radio" name={`q-${q.id}`} checked={answers[q.id] === oi} onChange={() => setAnswers({...answers, [q.id]: oi})} className="w-4 h-4 text-blue-600 dark:text-purple-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button onClick={submitQuiz} disabled={!allAnswered || loading} className="w-full btn-primary mt-6 disabled:opacity-50">{loading ? 'Submitting...' : 'Submit Answers'}</button>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Course Quizzes</h3>
      <div className="space-y-3">
        {quizzes.map(quiz => (
          <button key={quiz.id} onClick={() => startQuiz(quiz)} className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-purple-500 hover:bg-blue-50 dark:hover:bg-purple-900/30 transition-colors">
            <p className="font-medium text-gray-900 dark:text-white">{quiz.title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{quiz.questions?.length || 0} questions</p>
          </button>
        ))}
      </div>
      <button onClick={() => setShowQuiz(false)} className="w-full btn-secondary mt-4">Close</button>
    </div>
  )
}
