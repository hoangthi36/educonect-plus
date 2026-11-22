import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SiteFooter from '../components/SiteFooter.jsx'
import SiteHeader from '../components/SiteHeader.jsx'

function PublicLayout() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const section = document.getElementById(location.hash.slice(1))
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }

    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname, location.hash])

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Bỏ qua điều hướng
      </a>
      <SiteHeader />
      <main id="main-content">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}

export default PublicLayout
