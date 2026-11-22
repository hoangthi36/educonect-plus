import { Link } from 'react-router-dom'

const formatVnd = (value) => `${new Intl.NumberFormat('vi-VN').format(value)}đ`

function TutorCard({ tutor, layout = 'grid' }) {
  return (
    <article className={`tutor-card tutor-card--${layout}`}>
      <div className="tutor-card__top">
        <div className={`tutor-card__avatar tutor-card__avatar--${tutor.accent}`} aria-hidden="true">
          {tutor.initials}
        </div>
        <div className="tutor-card__body">
          <span className="tutor-card__caption">Hồ sơ minh họa</span>
          <h3>{tutor.name}</h3>
          <p>{tutor.headline} · {tutor.area}, {tutor.city}</p>
        </div>
      </div>

      <div className="tag-list">
        {tutor.subjects.slice(0, 3).map((item) => <span key={item}>{item}</span>)}
      </div>

      <p className="tutor-card__experience">{tutor.experience}</p>

      <div className="tutor-card__footer">
        <span>
          <small>Mức tham khảo</small>
          <strong>{formatVnd(tutor.rate)} / buổi</strong>
        </span>
        <Link className="button button--outline button--small" to={`/tutors/${tutor.id}`}>
          Xem hồ sơ
        </Link>
      </div>
    </article>
  )
}

export default TutorCard
