import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { dashboardPathForRole, useAuth } from '../features/auth/AuthContext.jsx'

function RegisterPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'parent' })
  const [error, setError] = useState('')
  const [fields, setFields] = useState({})
  const [submitting, setSubmitting] = useState(false)

  if (auth.status === 'authenticated') {
    return <Navigate to={dashboardPathForRole(auth.user.role)} replace />
  }

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setFields({})
    try {
      await auth.register(form)
      navigate('/login', { replace: true, state: { registered: true } })
    } catch (requestError) {
      setError(requestError.message)
      setFields(requestError.fields || {})
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="container auth-page__grid">
        <div className="auth-page__intro">
          <span className="eyebrow">Đăng ký thật</span>
          <h1>Tạo tài khoản Educonect+</h1>
          <p>Đăng ký công khai chỉ dành cho phụ huynh và gia sư. Tài khoản quản trị không thể tạo từ biểu mẫu này.</p>
        </div>
        <form className="auth-card" onSubmit={submit}>
          <h2>Thông tin cơ bản</h2>
          {error && <div className="form-message form-message--error" role="alert">{error}</div>}
          <label className="form-field">
            <span>Họ và tên</span>
            <input name="name" autoComplete="name" required minLength="2" maxLength="80" value={form.name} onChange={update} />
            {fields.name && <small className="field-error">{fields.name}</small>}
          </label>
          <label className="form-field">
            <span>Email</span>
            <input name="email" type="email" autoComplete="email" required maxLength="254" value={form.email} onChange={update} />
            {fields.email && <small className="field-error">{fields.email}</small>}
          </label>
          <label className="form-field">
            <span>Mật khẩu</span>
            <input name="password" type="password" autoComplete="new-password" required minLength="12" maxLength="128" value={form.password} onChange={update} />
            <small>Từ 12 đến 128 ký tự.</small>
            {fields.password && <small className="field-error">{fields.password}</small>}
          </label>
          <label className="form-field">
            <span>Vai trò</span>
            <select name="role" value={form.role} onChange={update}>
              <option value="parent">Phụ huynh</option>
              <option value="tutor">Gia sư</option>
            </select>
            {fields.role && <small className="field-error">{fields.role}</small>}
          </label>
          <button className="button button--primary" type="submit" disabled={submitting || auth.status === 'loading'}>
            {submitting ? 'Đang tạo tài khoản…' : 'Đăng ký'}
          </button>
          <p className="auth-card__footnote">Đã có tài khoản? <Link to="/login">Đăng nhập</Link>.</p>
        </form>
      </div>
    </section>
  )
}

export default RegisterPage
