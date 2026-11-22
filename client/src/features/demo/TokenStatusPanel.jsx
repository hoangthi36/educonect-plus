import { useDemo } from './DemoStore.jsx'

const ledgerLabels = {
  CREDIT_GRANTED: 'Cấp seed',
  HELD: 'Giữ Token',
  RELEASED: 'Trả hold',
  CONSUMED: 'Đã sử dụng',
  REFUNDED: 'Đã hoàn',
}

function getTokenPresentation(state) {
  if (state.tutor.blocked) return { label: 'Khóa nhận kết nối', tone: 'danger' }
  if (state.tokens.held > 0) return { label: `${state.tokens.held} Token đang giữ`, tone: 'warning' }
  if (state.tokens.available > 0) return { label: `${state.tokens.available} Token khả dụng`, tone: 'success' }
  return { label: 'Hết Token khả dụng', tone: 'neutral' }
}

function formatDelta(value) {
  if (!value) return '0'
  return value > 0 ? `+${value}` : String(value)
}

function TokenStatusPanel() {
  const { state } = useDemo()
  const presentation = getTokenPresentation(state)

  return (
    <section className="token-panel" aria-labelledby="token-panel-title">
      <div className="token-panel__heading">
        <div>
          <span className="eyebrow">Trang Token mô phỏng</span>
          <h3 id="token-panel-title">Token & gói kết nối</h3>
        </div>
        <span className={`token-state token-state--${presentation.tone}`}>{presentation.label}</span>
      </div>

      <div className="token-metrics">
        <div><span>Khả dụng</span><strong>{state.tokens.available}</strong><small>Có thể dùng cho kết nối mới</small></div>
        <div><span>Đang giữ</span><strong>{state.tokens.held}</strong><small>Chưa phải Token đã dùng</small></div>
        <div><span>Đã sử dụng</span><strong>{state.tokens.consumed}</strong><small>Tổng consumption trong demo</small></div>
      </div>

      <div className={`token-message token-message--${presentation.tone}`}>
        <strong>{state.tutor.blocked ? 'Đang chờ Admin xem xét' : 'Số dư chung của các persona'}</strong>
        <p>
          {state.tutor.blocked
            ? 'Khóa chỉ chặn nhận kết nối mới. Lịch sử và hỗ trợ vẫn xem được; không tự hoàn Token lần hai.'
            : 'Đổi giữa phụ huynh và gia sư không làm thay đổi hoặc cấp lại số dư.'}
        </p>
      </div>

      <div className="token-package-card">
        <div><span>Gói dự kiến dành cho gia sư</span><strong>300.000 VND / 2 service Tokens</strong></div>
        <button className="button button--secondary" type="button" disabled>Thanh toán chưa mở</button>
      </div>

      <div className="token-history">
        <strong>Lịch sử biến động Token</strong>
        <span>{state.tokens.refunded} Token đã hoàn trong demo</span>
      </div>

      <div className="token-ledger" role="table" aria-label="Lịch sử biến động Token mô phỏng">
        {state.ledger.map((entry) => (
          <div role="row" key={entry.id}>
            <div role="cell"><strong>{ledgerLabels[entry.type] ?? entry.type}</strong><small>{entry.connectionId ?? 'Seed demo'}</small></div>
            <span role="cell">Khả dụng {formatDelta(entry.deltaAvailable)}</span>
            <span role="cell">Đang giữ {formatDelta(entry.deltaHeld)}</span>
            <p role="cell">{entry.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TokenStatusPanel
