import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../features/auth/api.js'
import { roleLabels, useAuth } from '../features/auth/AuthContext.jsx'

function AdminSummary() {
  const [state, setState] = useState({ loading: true, data: null, error: '' })

  useEffect(() => {
    let active = true
    apiRequest('/api/admin/summary')
      .then((payload) => active && setState({ loading: false, data: payload.users, error: '' }))
      .catch((error) => active && setState({ loading: false, data: null, error: error.message }))
    return () => { active = false }
  }, [])

  if (state.loading) return <p>Đang tải thống kê tài khoản…</p>
  if (state.error) return <p className="form-message form-message--error">{state.error}</p>

  return (
    <div className="dashboard-stats">
      <div><span>Tổng tài khoản</span><strong>{state.data.total}</strong><small>Dữ liệu MongoDB thật</small></div>
      <div><span>Phụ huynh</span><strong>{state.data.parent}</strong><small>Tài khoản đăng ký</small></div>
      <div><span>Gia sư</span><strong>{state.data.tutor}</strong><small>Tài khoản đăng ký</small></div>
    </div>
  )
}

function RealDashboardPage({ role }) {
  const { user } = useAuth()
  const isParent = role === 'parent'
  const isTutor = role === 'tutor'
  const isAdmin = role === 'admin'

  return (
    <section className="account-page">
      <div className="container account-page__inner">
        <div className="account-page__heading">
          <div>
            <span className="eyebrow">Dashboard tài khoản thật</span>
            <h1>Xin chào, {user.name}</h1>
            <p>Vai trò do backend xác nhận: <strong>{roleLabels[user.role]}</strong>.</p>
          </div>
          <Link className="button button--outline" to="/account/profile">Chỉnh sửa hồ sơ</Link>
        </div>

        {isAdmin && <AdminSummary />}

        <div className="real-dashboard-grid">
          <article className="dashboard-card">
            <div className="dashboard-card__heading"><h2>Trạng thái tài khoản</h2><span className="neutral-status">Đang hoạt động</span></div>
            <dl className="need-summary">
              <div><dt>Email</dt><dd>{user.email}</dd></div>
              <div><dt>Vai trò</dt><dd>{roleLabels[user.role]}</dd></div>
              <div><dt>Xác minh hồ sơ</dt><dd>Chưa xác minh</dd></div>
            </dl>
          </article>

          {isParent && (
            <article className="dashboard-card">
              <span className="eyebrow">Chưa triển khai</span>
              <h2>Kết nối và lớp học thật chưa mở</h2>
              <p>Phụ huynh không nạp Token hoặc đặt cọc. Hãy dùng danh mục công khai để tham khảo hồ sơ minh họa.</p>
              <Link className="button button--primary button--small" to="/tutors">Tìm gia sư</Link>
            </article>
          )}

          {isTutor && (
            <article className="dashboard-card">
              <span className="eyebrow">Token tài khoản thật</span>
              <h2>Chưa kích hoạt</h2>
              <p>Không có Token thật được cấp từ đăng ký hoặc `/demo`. Thanh toán chưa được triển khai.</p>
              <Link className="button button--outline button--small" to="/tutor/credits">Xem trạng thái Token</Link>
            </article>
          )}

          {isAdmin && (
            <article className="dashboard-card">
              <span className="eyebrow">RBAC thật</span>
              <h2>Chỉ thống kê tài khoản</h2>
              <p>Không có duyệt hồ sơ, xử lý báo hỏng hoặc cấp Token thật trong mốc này. Công cụ kịch bản vẫn tách riêng tại `/demo`.</p>
            </article>
          )}
        </div>
      </div>
    </section>
  )
}

export default RealDashboardPage
