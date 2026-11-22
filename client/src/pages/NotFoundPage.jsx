import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="status-page">
      <div className="container status-page__inner">
        <div className="status-card">
          <span className="status-card__icon" aria-hidden="true">404</span>
          <span className="eyebrow">Không tìm thấy trang</span>
          <h1>Đường dẫn này chưa tồn tại</h1>
          <p>Hãy quay lại trang chủ để tiếp tục khám phá phiên bản P2b của Educonect+.</p>
          <div className="status-card__actions">
            <Link className="button button--primary" to="/">Về trang chủ</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NotFoundPage
