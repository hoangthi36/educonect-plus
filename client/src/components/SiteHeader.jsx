import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { dashboardPathForRole, useAuth } from '../features/auth/AuthContext.jsx'
import Brand from './Brand.jsx'

const navItems = [
  { label: 'Khám phá', to: '/' },
  { label: 'Tìm gia sư', to: '/tutors' },
  { label: 'Bảng tin', to: '/posts' },
]

function SiteHeader() {
  const auth = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [logoutError, setLogoutError] = useState('')
  const menuButtonRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!isOpen) return undefined

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  const closeMenu = () => setIsOpen(false)

  const handleLogout = async () => {
    setLogoutError('')
    try {
      await auth.logout()
      closeMenu()
    } catch (error) {
      setLogoutError(error.message)
    }
  }

  return (
    <header className="site-header">
      <div className="site-header__inner container">
        <Brand onNavigate={closeMenu} />

        <button
          ref={menuButtonRef}
          className="menu-toggle"
          type="button"
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          aria-label={isOpen ? 'Đóng menu' : 'Mở menu'}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`site-header__menu${isOpen ? ' is-open' : ''}`} id="primary-navigation">
          <nav className="primary-nav" aria-label="Điều hướng chính">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={closeMenu}
                className={({ isActive }) => (isActive ? 'is-active' : undefined)}
              >
                {item.label}
              </NavLink>
            ))}
            <Link to="/#how-it-works" onClick={closeMenu}>
              Cách hoạt động
            </Link>
          </nav>

          <div className="auth-actions" aria-label={auth.user ? 'Tài khoản đã đăng nhập' : 'Tài khoản khách'}>
            <Link className="button button--outline button--small" to="/demo" onClick={closeMenu}>
              Xem demo
            </Link>
            {auth.status === 'loading' ? (
              <span className="header-auth-status" role="status">Đang kiểm tra phiên…</span>
            ) : auth.user ? (
              <>
                <Link
                  className="button button--ghost button--small"
                  to={dashboardPathForRole(auth.user.role)}
                  onClick={closeMenu}
                >
                  {auth.user.name}
                </Link>
                <button className="button button--primary button--small" type="button" onClick={handleLogout}>
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link className="button button--ghost button--small" to="/login" onClick={closeMenu}>
                  Đăng nhập
                </Link>
                <Link className="button button--primary button--small" to="/register" onClick={closeMenu}>
                  Đăng ký
                </Link>
              </>
            )}
            {logoutError && <span className="header-auth-error" role="alert">{logoutError}</span>}
          </div>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
