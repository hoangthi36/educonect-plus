import { Link } from 'react-router-dom'
import FixtureNotice from '../components/FixtureNotice.jsx'
import { posts } from '../fixtures/publicData.js'

function PostsPage() {
  return (
    <section className="posts-page">
      <div className="container posts-page__heading">
        <div>
          <span className="eyebrow">Bảng tin công khai</span>
          <h1>Nhu cầu học và giới thiệu gia sư</h1>
          <p>Nội dung mẫu giúp hình dung cách hai bên mô tả nhu cầu trước khi kết nối.</p>
        </div>
        <Link className="button button--primary" to="/login">Đăng bài khi đăng nhập mở</Link>
      </div>

      <div className="container">
        <FixtureNotice>
          Bài đăng là dữ liệu hư cấu và không chứa số điện thoại, email hoặc địa chỉ cụ thể.
        </FixtureNotice>

        <div className="post-grid">
          {posts.map((post) => (
            <article className="post-card" key={post.id}>
              <div className="post-card__topline">
                <span className={`post-type ${post.type === 'Nhu cầu phụ huynh' ? 'post-type--parent' : ''}`}>
                  {post.type}
                </span>
                <span>Dữ liệu minh họa</span>
              </div>
              <h2>{post.title}</h2>
              <p className="post-card__author">{post.author}</p>
              <p>{post.description}</p>
              <dl className="post-details">
                <div><dt>Môn học</dt><dd>{post.subject}</dd></div>
                <div><dt>Khu vực</dt><dd>{post.area}</dd></div>
                <div><dt>Thời gian</dt><dd>{post.schedule}</dd></div>
                <div><dt>Ngân sách</dt><dd>{post.budget}</dd></div>
              </dl>
              <Link className="button button--outline button--small" to="/login">
                Đăng nhập để quan tâm
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PostsPage
