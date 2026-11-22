function FixtureNotice({ children = 'Toàn bộ nội dung trên trang là dữ liệu minh họa cho giao diện.' }) {
  return (
    <div className="fixture-notice" role="note">
      <span className="fixture-notice__label">Dữ liệu minh họa</span>
      <p>{children}</p>
    </div>
  )
}

export default FixtureNotice
