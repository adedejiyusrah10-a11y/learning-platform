import React, { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function ReviewSection({ courseId }) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [hover, setHover] = useState(0)

  useEffect(() => { fetchReviews() }, [courseId])

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/courses/${courseId}/reviews`)
      setReviews(res.data)
    } catch (e) {}
  }

  const submitReview = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/courses/${courseId}/reviews`, { rating, comment })
      setComment('')
      fetchReviews()
    } catch (e) {}
  }

  return (
    <div>
      {user && (
        <form onSubmit={submitReview} className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Rate this course</h3>
          <div className="flex gap-1 mb-3">
            {[1,2,3,4,5].map((star) => (
              <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} className="focus:outline-none">
                <Star className={`w-6 h-6 ${star <= (hover || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
              </button>
            ))}
          </div>
          <textarea className="input-field mb-3" rows={3} placeholder="Write a comment (optional)" value={comment} onChange={(e) => setComment(e.target.value)} />
          <button type="submit" className="btn-primary">Submit Review</button>
        </form>
      )}
      <div className="space-y-4">
        {reviews.length === 0 && <p className="text-gray-500 dark:text-gray-400 text-center py-8">No reviews yet. Be the first!</p>}
        {reviews.map((r) => (
          <div key={r.id} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900 dark:text-white">{r.user_name}</span>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${s <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                ))}
              </div>
            </div>
            {r.comment && <p className="text-gray-600 dark:text-gray-400 text-sm">{r.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
