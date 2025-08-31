import { Navigate, useLocation } from 'react-router-dom'
import { Spin } from 'antd'
import { useAuth } from '../contexts/AuthContext.jsx'
import { normalizeRole } from '../constants/roles.js'

export default function ProtectedRoute({ roles, children }) {
  const location = useLocation()
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!user) {
    if (location.pathname === '/customer/cart') {
      return children
    }
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (roles) {
    const allowed = roles.map((r) => normalizeRole(r))
    if (!allowed.includes(user.role)) {
      return <Navigate to="/" replace />
    }
  }

  return children
}


