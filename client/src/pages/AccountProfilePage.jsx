import { useEffect, useState } from 'react'
import { roleLabels, useAuth } from '../features/auth/AuthContext.jsx'

function formFromUser(user) {
  return {
    name: user.name,
    phone: user.profile?.phone || '',
    location: user.profile?.location || '',
    headline: user.profile?.headline || '',
    subjects: (user.profile?.subjects || []).join(', '),
  }
}

function AccountProfilePage() {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState(() => formFromUser(user))
  const [message, setMessage] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => setForm(formFromUser(user)), [user])

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setMessage(null)
    const patch = {
      name: form.name,
      phone: form.phone,
      location: form.location,
      headline: form.headline,
    }
    if (user.role === 'tutor') {
      patch.subjects = form.subjects.split(',').map((item) => item.trim()).filter(Boolean)
    }
    try {
      await updateProfile(patch)
      setMessage({ kind: 'success', text: 'Đã lưu hồ sơ vào tài khoản thật.' })
    } catch (error) {
      setMessage({ kind: 'error', text: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="account-page">
      <div className="container account-page__inner">
        <div className="account-page__heading">
          <div><span className="eyebrow">Hồ sơ riêng tư</span><h1>Thông tin tài khoản</h1></div>
          <span className="account-role-badge">{roleLabels[user.role]}</span>
        </div>

        <form className="account-form" onSubmit={submit}>
          {message && <div className={`form-message form-message--${message.kind}`} role="status">{message.text}</div>}
          <div className="account-form__grid">
            <label className="form-field">
              <span>Họ và tên</span>
              <input name="name" required minLength="2" maxLength="80" value={form.name} onChange={update} />
            </label>
            <label className="form-field">
              <span>Email</span>
              <input value={user.email} disabled />
              <small>Email và vai trò không thể đổi từ hồ sơ.</small>
            </label>
            <label className="form-field">
              <span>Số điện thoại riêng tư</span>
              <input name="phone" maxLength="100" value={form.phone} onChange={update} placeholder="Không bắt buộc" />
            </label>
            <label className="form-field">
              <span>Khu vực</span>
              <input name="location" maxLength="100" value={form.location} onChange={update} placeholder="Không bắt buộc" />
            </label>
          </div>
          <label className="form-field">
            <span>Giới thiệu ngắn</span>
            <textarea name="headline" maxLength="160" value={form.headline} onChange={update} />
          </label>
          {user.role === 'tutor' && (
            <label className="form-field">
              <span>Môn dạy</span>
              <input name="subjects" maxLength="300" value={form.subjects} onChange={update} placeholder="Ví dụ: Toán, Vật lý" />
              <small>Phân tách các môn bằng dấu phẩy; tối đa 10 mục.</small>
            </label>
          )}
          <div className="account-form__actions">
            <button className="button button--primary" type="submit" disabled={submitting}>
              {submitting ? 'Đang lưu…' : 'Lưu hồ sơ'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default AccountProfilePage
