import { Link } from 'react-router-dom'
import Brand from './Brand.jsx'

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <Brand footer />
          <p className="site-footer__note">
            Nền tảng kết nối phụ huynh và gia sư cho nhu cầu học trực tiếp 1–1.
          </p>
        </div>

        <div className="site-footer__links">
          <strong>Khám phá</strong>
          <Link to="/tutors">Tìm gia sư</Link>
          <Link to="/posts">Bảng tin</Link>
          <Link to="/#how-it-works">Cách hoạt động</Link>
          <Link to="/demo">Mô phỏng nghiệp vụ</Link>
        </div>

        <div className="site-footer__links">
          <strong>Thông tin</strong>
          <Link to="/support">Trung tâm hỗ trợ</Link>
          <span>Phiên bản tiến độ P2b</span>
        </div>
      </div>
      <div className="container site-footer__bottom">
        <span>© 2026 Educonect+</span>
        <span>Trang giới thiệu — chưa mở tài khoản hoặc thanh toán</span>
      </div>
    </footer>
  )
}

export default SiteFooter
