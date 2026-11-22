import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TutorCard from '../components/TutorCard.jsx'
import { subjectOptions, tutors } from '../fixtures/publicData.js'

const featuredTutors = tutors.slice(0, 3)

const connectionSteps = [
  {
    title: 'Chia sẻ nhu cầu học',
    description: 'Chọn môn học, khu vực và khung giờ phù hợp với gia đình.',
  },
  {
    title: 'Trao đổi để hiểu nhau',
    description: 'Phụ huynh và gia sư thống nhất mục tiêu, cách học và mức phí dự kiến.',
  },
  {
    title: 'Thống nhất buổi dạy thử',
    description: 'Hai bên chốt nội dung và thời gian trước khi quyết định đồng hành.',
  },
]

function HomePage() {
  const [subject, setSubject] = useState('')
  const [location, setLocation] = useState('Hà Nội')
  const navigate = useNavigate()

  const handleSearch = (event) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (subject.trim()) params.set('subject', subject.trim())
    if (location) params.set('location', location)
    navigate(`/tutors${params.size ? `?${params.toString()}` : ''}`)
  }

  return (
    <>
      <section className="hero-section">
        <div className="container hero">
          <div className="hero__content">
            <span className="eyebrow">Kết nối gia sư 1–1 · Học trực tiếp</span>
            <h1>
              Gia sư phù hợp.
              <span>Kết nối để cùng tiến bộ.</span>
            </h1>
            <p className="hero__lead">
              Tìm gia sư dạy trực tiếp 1–1, trao đổi nhu cầu và thống nhất buổi dạy thử.
              Phụ huynh không đặt cọc qua nền tảng.
            </p>

            <form className="hero-search" onSubmit={handleSearch} aria-label="Tìm gia sư">
              <label className="search-field">
                <span>Môn học</span>
                <input
                  type="search"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="Ví dụ: Toán lớp 9"
                />
              </label>
              <label className="search-field search-field--location">
                <span>Khu vực</span>
                <select value={location} onChange={(event) => setLocation(event.target.value)}>
                  <option>Hà Nội</option>
                  <option>TP. Hồ Chí Minh</option>
                  <option>Đà Nẵng</option>
                </select>
              </label>
              <button className="button button--primary hero-search__submit" type="submit">
                Tìm gia sư
              </button>
            </form>
            <p className="hero__search-note">Kết quả sử dụng hồ sơ minh họa và không chứa thông tin liên hệ riêng tư.</p>
          </div>

          <div className="hero__visual" aria-label="Minh họa kết nối phụ huynh và gia sư">
            <div className="hero__glow" />
            <div className="connection-card connection-card--parent">
              <span className="connection-card__icon" aria-hidden="true">PH</span>
              <div>
                <strong>Phụ huynh</strong>
                <small>Đang tìm gia sư Toán lớp 9</small>
              </div>
            </div>
            <div className="connection-line" aria-hidden="true">
              <span />
            </div>
            <div className="connection-card connection-card--tutor">
              <span className="connection-card__icon" aria-hidden="true">GS</span>
              <div>
                <strong>Gia sư phù hợp</strong>
                <small>Cùng trao đổi buổi dạy thử</small>
              </div>
            </div>
            <div className="trust-note">
              <span aria-hidden="true">✓</span>
              <p><strong>Thông tin vừa đủ</strong><small>Trao đổi trước khi đồng hành</small></p>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Nguyên tắc kết nối">
        <div className="container trust-strip__grid">
          <div><strong>Dạy trực tiếp 1–1</strong><span>Linh hoạt theo nhu cầu học</span></div>
          <div><strong>Phụ huynh không đặt cọc</strong><span>Hai bên tự thỏa thuận học phí</span></div>
          <div><strong>Kết nối minh bạch</strong><span>Thống nhất trước buổi dạy thử</span></div>
        </div>
      </section>

      <section className="section" aria-labelledby="subjects-title">
        <div className="container">
          <div className="section-heading section-heading--row">
            <div>
              <span className="eyebrow">Bắt đầu từ môn học</span>
              <h2 id="subjects-title">Bạn đang cần hỗ trợ môn nào?</h2>
            </div>
            <Link className="text-link" to="/tutors">Xem danh mục gia sư</Link>
          </div>
          <div className="subject-list">
            {subjectOptions.map((item) => (
              <Link key={item} className="subject-chip" to={`/tutors?subject=${encodeURIComponent(item)}`}>
                <span aria-hidden="true">✦</span>
                {item}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tint" aria-labelledby="featured-title">
        <div className="container">
          <div className="section-heading section-heading--row">
            <div>
              <span className="eyebrow">Hồ sơ minh họa</span>
              <h2 id="featured-title">Một vài lựa chọn để bạn hình dung</h2>
              <p>Dữ liệu dưới đây chỉ phục vụ trình bày giao diện trong bản demo hiện tại.</p>
            </div>
            <span className="demo-label">Dữ liệu demo</span>
          </div>

          <div className="tutor-grid">
            {featuredTutors.map((tutor) => <TutorCard tutor={tutor} key={tutor.id} />)}
          </div>
        </div>
      </section>

      <section className="section process-section" id="how-it-works" aria-labelledby="process-title">
        <div className="container process-grid">
          <div className="process-intro">
            <span className="eyebrow">Cách hoạt động</span>
            <h2 id="process-title">Ba bước để bắt đầu một kết nối phù hợp</h2>
            <p>
              Educonect+ ưu tiên một hành trình dễ hiểu: bắt đầu từ nhu cầu thật, trao đổi rõ ràng
              và chỉ tiếp tục khi cả hai bên thấy phù hợp.
            </p>
            <Link className="button button--secondary" to="/register">Bắt đầu khi đăng ký mở</Link>
          </div>
          <ol className="process-list">
            {connectionSteps.map((step) => (
              <li key={step.title}>
                <span className="process-list__dot" aria-hidden="true" />
                <div><h3>{step.title}</h3><p>{step.description}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section audience-section" aria-labelledby="audience-title">
        <div className="container">
          <div className="section-heading section-heading--center">
            <span className="eyebrow">Mỗi bên một nhu cầu</span>
            <h2 id="audience-title">Educonect+ đồng hành từ điểm bắt đầu</h2>
          </div>
          <div className="audience-grid">
            <article className="audience-card audience-card--parent">
              <span>Phụ huynh</span>
              <h3>Tìm người phù hợp với mục tiêu học</h3>
              <p>Mô tả nhu cầu, xem thông tin công khai và trao đổi trước buổi dạy thử.</p>
              <Link className="button button--light" to="/register">Đăng ký dành cho phụ huynh</Link>
            </article>
            <article className="audience-card audience-card--tutor">
              <span>Gia sư</span>
              <h3>Chia sẻ chuyên môn đúng ngữ cảnh</h3>
              <p>Xây dựng hồ sơ cơ bản và tiếp cận những nhu cầu phù hợp khi tính năng được mở.</p>
              <Link className="button button--primary" to="/register">Đăng ký dành cho gia sư</Link>
            </article>
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage
