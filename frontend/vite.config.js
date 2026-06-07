import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/courses': 'http://localhost:8000',
      '/register': 'http://localhost:8000',
      '/token': 'http://localhost:8000',
      '/enroll': 'http://localhost:8000',
      '/progress': 'http://localhost:8000',
      '/categories': 'http://localhost:8000',
      '/me': 'http://localhost:8000',
      '/my-courses': 'http://localhost:8000',
      '/quizzes': 'http://localhost:8000',
      '/my-quiz-scores': 'http://localhost:8000',
      '/notes': 'http://localhost:8000',
      '/certificate': 'http://localhost:8000',
    },
  },
})
