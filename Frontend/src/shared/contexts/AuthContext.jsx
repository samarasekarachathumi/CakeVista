import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { normalizeRole } from '../constants/roles.js'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('accessToken')
    if (savedUser && savedToken) {
      const parsed = JSON.parse(savedUser)
      const normalized = { ...parsed, role: normalizeRole(parsed.role) }
      setUser(normalized)
      setToken(savedToken)
    }
    setLoading(false)
  }, [])

  const login = (userData, token, extraDetails) => {
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('accessToken', token)
    localStorage.setItem('extraDetails', JSON.stringify(extraDetails))
    setUser({ ...userData, role: normalizeRole(userData.role), ...extraDetails })
    setToken(token)
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    setUser(null)
    setToken(null)
    navigate('/login')
  }


  const value = useMemo(
    () => ({ user, token, loading, login, logout }),
    [user, token, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
