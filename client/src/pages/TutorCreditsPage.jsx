import { Link } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext.jsx'

function TutorCreditsPage() {
  const { user } = useAuth()
  return (
    <section className="account-page">
      <div className="container account-page__inner">
        <div className="account-page__heading">
          <div><span className="eyebrow">Tài khoản thật · {user.name}</span><h1>Token chưa kích hoạt</h1></div>
          <span className="account-role-badge">Gia sư</span>
        </div>
        <div className="real-dashboard-grid">
          <article className="dashboard-card">
            <h2>Không có số dư Token thật</h2>
            <p>Đăng ký tài khoản không cấp Token. Thanh toán 300.000đ / 2 Token và sổ Token thật chưa được xây dựng.</p>
          </article>
          <article className="dashboard-card">
            <h2>Mô phỏng được tách riêng</h2>
            <p>Các trạng thái khả dụng, đang giữ và đã sử dụng chỉ tồn tại trong fixture `/demo`; chúng không thay đổi tài khoản này.</p>
            <Link className="button button--outline button--small" to="/demo">Xem mô phỏng nghiệp vụ</Link>
          </article>
        </div>
      </div>
    </section>
  )
}

export default TutorCreditsPage
