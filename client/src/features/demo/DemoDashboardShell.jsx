function DemoDashboardShell({ role, title, description, navItems, children }) {
  return (
    <div className="demo-dashboard">
      <aside className="demo-sidebar">
        <div className="demo-sidebar__identity">
          <span aria-hidden="true">{role.slice(0, 2).toUpperCase()}</span>
          <div><strong>{role}</strong><small>Persona hư cấu</small></div>
        </div>
        <nav aria-label={`Menu ${role} mô phỏng`}>
          {navItems.map((item, index) => (
            <span className={index === 0 ? 'is-active' : ''} key={item}>{item}</span>
          ))}
        </nav>
        <p>Menu chỉ minh họa bố cục; không thay đổi route tài khoản thật.</p>
      </aside>

      <div className="demo-workspace">
        <header className="demo-workspace__header">
          <div><span className="eyebrow">Mô phỏng nghiệp vụ</span><h2>{title}</h2><p>{description}</p></div>
          <span className="demo-label">Không lưu dữ liệu</span>
        </header>
        {children}
      </div>
    </div>
  )
}

export default DemoDashboardShell
