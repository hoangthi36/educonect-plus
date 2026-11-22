import { useSearchParams } from 'react-router-dom'
import FixtureNotice from '../components/FixtureNotice.jsx'
import TutorCard from '../components/TutorCard.jsx'
import { locationOptions, priceOptions, subjectOptions, tutors } from '../fixtures/publicData.js'
import { filterTutors } from '../utils/filterTutors.js'

function TutorsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = {
    subject: searchParams.get('subject') ?? '',
    location: searchParams.get('location') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
  }
  const results = filterTutors(tutors, filters)
  const hasFilters = Object.values(filters).some(Boolean)

  const updateFilter = (key, value) => {
    const nextParams = new URLSearchParams(searchParams)
    if (value) nextParams.set(key, value)
    else nextParams.delete(key)
    setSearchParams(nextParams, { replace: true })
  }

  const resetFilters = () => setSearchParams({}, { replace: true })

  return (
    <section className="directory-page">
      <div className="container directory-page__intro">
        <div>
          <span className="eyebrow">Danh mục công khai</span>
          <h1>Tìm gia sư phù hợp với nhu cầu của bạn</h1>
          <p>Lọc hồ sơ mẫu theo môn học, khu vực và mức phí dự kiến.</p>
        </div>
        <span className="demo-label">Dữ liệu demo</span>
      </div>

      <div className="container">
        <FixtureNotice>
          Hồ sơ, lịch và mức phí chỉ để minh họa giao diện; không phải thông tin xác minh hoặc lời chào dịch vụ thật.
        </FixtureNotice>

        <div className="directory-layout">
          <aside className="filter-panel" aria-label="Bộ lọc gia sư">
            <div className="filter-panel__heading">
              <div><span aria-hidden="true">⌕</span><strong>Bộ lọc tìm kiếm</strong></div>
              {hasFilters && (
                <button className="filter-reset-link" type="button" onClick={resetFilters}>
                  Đặt lại
                </button>
              )}
            </div>

            <label className="form-field">
              <span>Môn học hoặc từ khóa</span>
              <input
                list="subject-suggestions"
                type="search"
                value={filters.subject}
                onChange={(event) => updateFilter('subject', event.target.value)}
                placeholder="Ví dụ: Toán, IELTS"
              />
              <datalist id="subject-suggestions">
                {subjectOptions.map((subject) => <option key={subject} value={subject} />)}
              </datalist>
            </label>

            <label className="form-field">
              <span>Khu vực</span>
              <select
                value={filters.location}
                onChange={(event) => updateFilter('location', event.target.value)}
              >
                <option value="">Tất cả khu vực</option>
                {locationOptions.map((location) => <option key={location}>{location}</option>)}
              </select>
            </label>

            <label className="form-field">
              <span>Mức phí dự kiến</span>
              <select
                value={filters.maxPrice}
                onChange={(event) => updateFilter('maxPrice', event.target.value)}
              >
                {priceOptions.map((option) => (
                  <option key={option.value || 'all'} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <button className="button button--outline filter-reset-button" type="button" onClick={resetFilters}>
              Xóa toàn bộ bộ lọc
            </button>
          </aside>

          <div className="directory-results">
            <div className="directory-results__heading">
              <div>
                <span className="eyebrow">Kết quả</span>
                <h2 aria-live="polite">{results.length} hồ sơ phù hợp</h2>
              </div>
              <span>Mức phí chỉ để tham khảo</span>
            </div>

            {results.length > 0 ? (
              <div className="directory-results__list">
                {results.map((tutor) => <TutorCard key={tutor.id} tutor={tutor} layout="list" />)}
              </div>
            ) : (
              <div className="empty-state" role="status">
                <span className="empty-state__icon" aria-hidden="true">⌕</span>
                <h2>Chưa có hồ sơ phù hợp</h2>
                <p>Hãy thử mở rộng khu vực, tăng mức phí dự kiến hoặc xóa từ khóa môn học.</p>
                <button className="button button--primary" type="button" onClick={resetFilters}>
                  Đặt lại bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TutorsPage
