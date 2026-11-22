import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { dashboardPathForRole, useAuth } from '../features/auth/AuthContext.jsx'

function safeNextPath(value, fallback) {
  return value?.startsWith('/') && !value.startsWith('//') ? value : fallback
}

function LoginPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (auth.status === 'authenticated') {
    return <Navigate to={dashboardPathForRole(auth.user.role)} replace />
  }

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const user = await auth.login(form)
      navigate(safeNextPath(searchParams.get('next'), dashboardPathForRole(user.role)), { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="container auth-page__grid">
        <div className="auth-page__intro">
          <span className="eyebrow">Tài khoản thật</span>
          <h1>Đăng nhập Educonect+</h1>
          <p>Phiên đăng nhập được lưu ở máy chủ bằng cookie HttpOnly. Không có role hoặc mật khẩu trong localStorage.</p>
        </div>
        <form className="auth-card" onSubmit={submit}>
          <h2>Chào mừng bạn trở lại</h2>
          {location.state?.registered && <div className="form-message form-message--success">Đăng ký thành công. Hãy đăng nhập.</div>}
          {error && <div className="form-message form-message--error" role="alert">{error}</div>}
          <label className="form-field">
            <span>Email</span>
            <input name="email" type="email" autoComplete="email" required maxLength="254" value={form.email} onChange={update} />
          </label>
          <label className="form-field">
            <span>Mật khẩu</span>
            <input name="password" type="password" autoComplete="current-password" required maxLength="128" value={form.password} onChange={update} />
          </label>
          <button className="button button--primary" type="submit" disabled={submitting || auth.status === 'loading'}>
            {submitting ? 'Đang đăng nhập…' : 'Đăng nhập'}
          </button>
          <p className="auth-card__footnote">Chưa có tài khoản? <Link to="/register">Đăng ký phụ huynh hoặc gia sư</Link>.</p>
        </form>
      </div>
    </section>
  )
}

export default LoginPage
