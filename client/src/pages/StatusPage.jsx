import { Link } from 'react-router-dom'

function StatusPage({
  eyebrow,
  title,
  description,
  secondaryTo = '/#how-it-works',
  secondaryLabel = 'Xem cách hoạt động',
}) {
  return (
    <section className="status-page">
      <div className="container status-page__inner">
        <div className="status-card">
          <span className="status-card__icon" aria-hidden="true">i</span>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
          <div className="status-card__actions">
            <Link className="button button--primary" to="/">Về trang chủ</Link>
            <Link className="button button--outline" to={secondaryTo}>{secondaryLabel}</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StatusPage
