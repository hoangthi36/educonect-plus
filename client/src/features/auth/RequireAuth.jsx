import { Navigate, useLocation } from 'react-router-dom'
import ForbiddenPage from '../../pages/ForbiddenPage.jsx'
import { useAuth } from './AuthContext.jsx'

function AuthStatus({ title, children }) {
  return (
    <section className="status-page">
      <div className="container status-page__inner">
        <div className="status-card">
          <span className="eyebrow">Tài khoản thật</span>
          <h1>{title}</h1>
          <p>{children}</p>
        </div>
      </div>
    </section>
  )
}

export function RequireAuth({ children, roles }) {
  const auth = useAuth()
  const location = useLocation()

  if (auth.status === 'loading') {
    return <AuthStatus title="Đang kiểm tra phiên">Vui lòng đợi trong giây lát.</AuthStatus>
  }
  if (auth.status === 'error') {
    return <AuthStatus title="Không thể kiểm tra phiên">Máy chủ xác thực hiện không khả dụng. Vui lòng thử lại.</AuthStatus>
  }
  if (!auth.user) {
    const next = `${location.pathname}${location.search}`
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />
  }
  if (roles && !roles.includes(auth.user.role)) {
    return <ForbiddenPage />
  }
  return children
}
