import { Route, Routes } from 'react-router-dom'
import { RequireAuth } from './features/auth/RequireAuth.jsx'
import { DemoProvider } from './features/demo/DemoStore.jsx'
import PublicLayout from './layouts/PublicLayout.jsx'
import AccountProfilePage from './pages/AccountProfilePage.jsx'
import DemoPage from './pages/DemoPage.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import PostsPage from './pages/PostsPage.jsx'
import RealDashboardPage from './pages/RealDashboardPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import StatusPage from './pages/StatusPage.jsx'
import TutorProfilePage from './pages/TutorProfilePage.jsx'
import TutorCreditsPage from './pages/TutorCreditsPage.jsx'
import TutorsPage from './pages/TutorsPage.jsx'

const pendingPages = {
  support: {
    eyebrow: 'Đang xây dựng',
    title: 'Trung tâm hỗ trợ đang được chuẩn bị',
    description:
      'Các chính sách chưa chốt sẽ không được hiển thị như cam kết. Nội dung hỗ trợ sẽ được cập nhật ở mốc phù hợp.',
  },
}

function App() {
  return (
    <DemoProvider>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="tutors" element={<TutorsPage />} />
          <Route path="tutors/:tutorId" element={<TutorProfilePage />} />
          <Route path="posts" element={<PostsPage />} />
          <Route path="demo" element={<DemoPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="support" element={<StatusPage {...pendingPages.support} />} />
          <Route path="account/profile" element={<RequireAuth><AccountProfilePage /></RequireAuth>} />
          <Route path="parent/dashboard" element={<RequireAuth roles={['parent']}><RealDashboardPage role="parent" /></RequireAuth>} />
          <Route path="tutor/dashboard" element={<RequireAuth roles={['tutor']}><RealDashboardPage role="tutor" /></RequireAuth>} />
          <Route path="tutor/credits" element={<RequireAuth roles={['tutor']}><TutorCreditsPage /></RequireAuth>} />
          <Route path="admin" element={<RequireAuth roles={['admin']}><RealDashboardPage role="admin" /></RequireAuth>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </DemoProvider>
  )
}

export default App
