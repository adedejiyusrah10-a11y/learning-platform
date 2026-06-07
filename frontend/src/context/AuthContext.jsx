import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.get('/me').then(res => { setUser(res.data); setLoading(false) })
        .catch(() => { localStorage.removeItem('token'); setLoading(false) })
    } else setLoading(false)
  }, [])

  const login = async (email, password) => {
    const formData = new FormData()
    formData.append('username', email)
    formData.append('password', password)
    const res = await api.post('/token', formData, { headers: { 'Content-Type': 'multipart/form-data' }})
    localStorage.setItem('token', res.data.access_token)
    setUser(res.data.user)
    return res.data
  }

  const register = async (email, password, fullName) => {
    const res = await api.post('/register', { email, password, full_name: fullName })
    return res.data
  }

  const logout = () => { localStorage.removeItem('token'); setUser(null) }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
