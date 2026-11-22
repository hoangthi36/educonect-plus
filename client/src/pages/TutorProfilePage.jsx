import { Link, useParams } from 'react-router-dom'
import FixtureNotice from '../components/FixtureNotice.jsx'
import { tutors } from '../fixtures/publicData.js'
import NotFoundPage from './NotFoundPage.jsx'

const formatVnd = (value) => `${new Intl.NumberFormat('vi-VN').format(value)}đ`

function TutorProfilePage() {
  const { tutorId } = useParams()
  const tutor = tutors.find((item) => item.id === tutorId)

  if (!tutor) return <NotFoundPage />

  return (
    <section className="profile-page">
      <div className="container">
        <nav className="breadcrumbs" aria-label="Đường dẫn trang">
          <Link to="/tutors">Tìm gia sư</Link>
          <span aria-hidden="true">/</span>
          <span>{tutor.name}</span>
        </nav>

        <FixtureNotice>
          Đây là hồ sơ hư cấu. Trang không hiển thị số điện thoại, email, địa chỉ cụ thể hoặc giấy tờ cá nhân.
        </FixtureNotice>

        <div className="profile-layout">
          <div className="profile-main">
            <article className="profile-card profile-card--summary">
              <div className={`profile-avatar tutor-card__avatar--${tutor.accent}`} aria-hidden="true">
                {tutor.initials}
              </div>
              <div>
                <span className="tutor-card__caption">Hồ sơ minh họa</span>
                <h1>{tutor.name}</h1>
                <p className="profile-headline">{tutor.headline}</p>
                <p className="profile-meta">{tutor.education}</p>
                <p className="profile-meta">Khu vực tương đối: {tutor.area}, {tutor.city}</p>
                <span className="neutral-status">Chưa xác minh trong bản báo cáo</span>
              </div>
            </article>

            <article className="profile-card">
              <h2>Giới thiệu</h2>
              <p>{tutor.introduction}</p>
              <h2>Phương pháp đồng hành</h2>
              <p>{tutor.approach}</p>
            </article>

            <article className="profile-card">
              <h2>Môn học có thể trao đổi</h2>
              <div className="tag-list tag-list--large">
                {tutor.subjects.map((subject) => <span key={subject}>{subject}</span>)}
              </div>
              <h2>Khung thời gian tham khảo</h2>
              <div className="availability-list">
                {tutor.availability.map((slot) => <span key={slot}>{slot}</span>)}
              </div>
              <p className="profile-footnote">Lịch thực tế cần được hai bên trao đổi lại; bản hiện tại chưa có đặt lịch.</p>
            </article>
          </div>

          <aside className="profile-sidebar">
            <div className="profile-card profile-cta-card">
              <span>Mức phí tham khảo</span>
              <strong>{formatVnd(tutor.rate)} <small>/ buổi</small></strong>
              <p>Học phí dạy thử và các buổi sau do hai bên tự thỏa thuận. Phụ huynh không đặt cọc qua nền tảng.</p>
              <Link className="button button--primary" to="/login">
                Đăng nhập phụ huynh để kết nối
              </Link>
              <small>Đăng nhập thật chưa được triển khai ở bản hiện tại.</small>
            </div>

            <div className="privacy-card">
              <strong>Thông tin công khai có giới hạn</strong>
              <p>Chỉ hiển thị chuyên môn, khu vực tương đối, lịch tham khảo và mức phí dự kiến.</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default TutorProfilePage
