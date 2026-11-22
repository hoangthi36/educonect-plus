import { Link } from 'react-router-dom'
import { dashboardPathForRole, useAuth } from '../features/auth/AuthContext.jsx'

function ForbiddenPage() {
  const { user } = useAuth()
  return (
    <section className="status-page">
      <div className="container status-page__inner">
        <div className="status-card">
          <span className="status-card__icon" aria-hidden="true">403</span>
          <span className="eyebrow">Sai quyền truy cập</span>
          <h1>Bạn không có quyền mở trang này</h1>
          <p>Quyền được kiểm tra lại tại backend; giao diện không thể tự đổi vai trò tài khoản.</p>
          <div className="status-card__actions">
            <Link className="button button--primary" to={dashboardPathForRole(user?.role)}>Về dashboard của tôi</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ForbiddenPage
