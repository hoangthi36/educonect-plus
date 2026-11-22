import { Link } from 'react-router-dom'

function Brand({ footer = false, onNavigate }) {
  return (
    <Link
      className={`brand${footer ? ' brand--footer' : ''}`}
      to="/"
      onClick={onNavigate}
      aria-label="Educonect+ — về trang chủ"
    >
      <span className="brand__mark" aria-hidden="true">
        <img src="/brand/educonect-logo.png" alt="" />
      </span>
      <span className="brand__copy">
        <strong>Educonect+</strong>
        <small>Kết nối đúng người – Trao gửi niềm tin – Đồng hành cùng tri thức</small>
      </span>
    </Link>
  )
}

export default Brand
