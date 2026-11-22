import { AdminPanel, GuestPanel, ParentPanel, TutorPanel } from '../features/demo/DemoPanels.jsx'
import { demoPersonas } from '../features/demo/demoPersonas.js'
import { useDemo } from '../features/demo/DemoStore.jsx'

function DemoExperience() {
  const { state, setPersona, resetDemo } = useDemo()
  const persona = demoPersonas.find((item) => item.id === state.personaId) ?? demoPersonas[0]

  const renderPanel = () => {
    if (persona.kind === 'parent') return <ParentPanel />
    if (persona.kind === 'tutor') return <TutorPanel />
    if (persona.kind === 'admin') return <AdminPanel />
    return <GuestPanel />
  }

  return (
    <section className="demo-page">
      <div className="demo-banner" role="note">
        MÔ PHỎNG NGHIỆP VỤ — KHÔNG THU TIỀN
      </div>

      <div className="container demo-page__intro">
        <div>
          <span className="eyebrow">Playground P2b</span>
          <h1>Một luồng chung, nhiều góc nhìn hư cấu</h1>
          <p>
            Đổi persona không phải đăng nhập hoặc phân quyền. Connection, chat và Token dùng chung một
            reducer, không reset khi đổi góc nhìn và mất hoàn toàn khi tải lại trang.
          </p>
        </div>

        <div className="demo-page__controls">
          <label className="persona-picker">
            <span>Persona đang xem</span>
            <select value={state.personaId} onChange={(event) => setPersona(event.target.value)}>
              {demoPersonas.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
            <small>{persona.description}</small>
          </label>
          <button className="button button--outline" type="button" onClick={resetDemo}>
            Đặt lại demo
          </button>
        </div>
      </div>

      <div className="container demo-page__scope-note">
        <strong>Dữ liệu không lưu lâu dài</strong>
        <span>Chỉ dùng fixture trong bộ nhớ; không API, auth, thanh toán, SMS, OCR hoặc upload giấy tờ.</span>
      </div>

      <div className={`container demo-notice demo-notice--${state.notice.kind}`} role="status" aria-live="polite">
        <strong>{state.notice.kind === 'error' ? 'Action không hợp lệ' : 'Trạng thái demo'}</strong>
        <span>{state.notice.message}</span>
      </div>

      <div className="container demo-page__content">
        {renderPanel()}
      </div>
    </section>
  )
}

function DemoPage() {
  return <DemoExperience />
}

export default DemoPage
