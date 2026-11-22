import { Link } from 'react-router-dom'
import DemoChatPanel from './DemoChatPanel.jsx'
import DemoDashboardShell from './DemoDashboardShell.jsx'
import { useDemo } from './DemoStore.jsx'
import { ConnectionStatus, connectionStatusLabels, DemoAction } from './demoReducer.js'
import ScenarioTools from './ScenarioTools.jsx'
import TokenStatusPanel from './TokenStatusPanel.jsx'

const CLOSABLE_STATUSES = new Set([ConnectionStatus.IN_CHAT, ConnectionStatus.TRIAL_PROPOSED])

function ConnectionStatusCard({ actor }) {
  const { state, send } = useDemo()
  const { connection, tokens, tutor } = state
  const canSendConnect = (
    actor === 'tutor'
    && connection.status === ConnectionStatus.READY
    && tokens.available > 0
    && !tutor.blocked
  )
  const canAcceptConnect = actor === 'parent' && connection.status === ConnectionStatus.REQUESTED
  const canPropose = actor === 'tutor' && connection.status === ConnectionStatus.IN_CHAT && tokens.held > 0
  const canReportFailure = actor === 'tutor' && connection.status === ConnectionStatus.TRIAL_ACCEPTED
  const canClose = CLOSABLE_STATUSES.has(connection.status)

  return (
    <section className="dashboard-card connection-action-card">
      <div className="dashboard-card__heading">
        <div><span className="eyebrow">Kết nối chung</span><h3>Toán lớp 9 · Cầu Giấy</h3></div>
        <span className="neutral-status">{connectionStatusLabels[connection.status]}</span>
      </div>
      <p>
        Connection ID: <code>{connection.id}</code>. Phụ huynh và gia sư đang xem cùng một state trong bộ nhớ.
      </p>

      <div className="connection-action-card__actions">
        {actor === 'tutor' && (
          <button
            className="button button--primary"
            type="button"
            disabled={!canSendConnect}
            onClick={() => send(DemoAction.TUTOR_SEND_CONNECT, { actor: 'tutor' })}
          >
            Gửi Connect
          </button>
        )}

        {canAcceptConnect && (
          <>
            <button
              className="button button--primary"
              type="button"
              onClick={() => send(DemoAction.PARENT_ACCEPT_CONNECT, { actor: 'parent' })}
            >
              Chấp nhận Connect
            </button>
            <button
              className="button button--outline"
              type="button"
              onClick={() => send(DemoAction.PARENT_DECLINE_CONNECT, { actor: 'parent' })}
            >
              Từ chối Connect
            </button>
          </>
        )}

        {canPropose && (
          <button
            className="button button--primary"
            type="button"
            onClick={() => send(DemoAction.TUTOR_PROPOSE_TRIAL, {
              actor: 'tutor',
              proposal: {
                schedule: '19:00 Thứ 6 tuần này',
                content: 'Khảo sát kiến thức Toán lớp 9 và thống nhất lộ trình',
                location: 'Khu vực Cầu Giấy, Hà Nội',
                fee: 'Chi phí dạy thử do hai bên thỏa thuận',
              },
            })}
          >
            Gửi đề xuất Buổi 0
          </button>
        )}

        {canClose && (
          <button
            className="button button--outline"
            type="button"
            onClick={() => send(DemoAction.CLOSE_BEFORE_TRIAL, { actor })}
          >
            Đóng kết nối trước Buổi 0
          </button>
        )}

        {canReportFailure && (
          <button
            className="button button--danger"
            type="button"
            onClick={() => send(DemoAction.TUTOR_REPORT_FAILURE, {
              actor: 'tutor',
              reason: 'Hai bên không tiếp tục sau Buổi 0',
            })}
          >
            Gửi yêu cầu báo hỏng
          </button>
        )}
      </div>

      {actor === 'tutor' && connection.status === ConnectionStatus.REQUESTED && (
        <p className="dashboard-card__note">Đang chờ phụ huynh. Gửi Connect chưa giữ Token.</p>
      )}
      {actor === 'tutor' && connection.status === ConnectionStatus.TRIAL_PROPOSED && (
        <p className="dashboard-card__note">Đề xuất đang chờ phản hồi; không trừ thêm Token.</p>
      )}
      {connection.status === ConnectionStatus.FAILURE_REVIEW && (
        <p className="dashboard-card__note">Báo hỏng chỉ đang chờ xác minh; chưa hoàn Token.</p>
      )}
      {tutor.blocked && (
        <p className="dashboard-card__note">Đang khóa nhận kết nối mới. Lịch sử và hỗ trợ vẫn khả dụng.</p>
      )}
    </section>
  )
}

export function GuestPanel() {
  const { state } = useDemo()

  return (
    <div className="demo-guest-panel">
      <span className="eyebrow">Persona khách</span>
      <h2>Xem nội dung công khai mà không đổi vai trò tài khoản</h2>
      <p>
        Khách không có action trong luồng. Trạng thái demo hiện tại là{' '}
        <strong>{connectionStatusLabels[state.connection.status]}</strong> và được giữ nguyên khi đổi góc nhìn.
      </p>
      <div className="demo-guest-actions">
        <Link className="button button--primary" to="/tutors">Xem danh mục gia sư</Link>
        <Link className="button button--outline" to="/posts">Xem bảng tin</Link>
      </div>
    </div>
  )
}

export function ParentPanel() {
  const { state } = useDemo()
  const { connection, tokens } = state

  return (
    <DemoDashboardShell
      role="Phụ huynh"
      title="Tổng quan nhu cầu học"
      description="Góc nhìn phụ huynh dùng chung connection và Token state với gia sư."
      navItems={['Tổng quan', 'Nhu cầu của tôi', 'Kết nối của tôi', 'Tin nhắn', 'Tài khoản']}
    >
      <div className="dashboard-stats">
        <div><span>Trạng thái Connect</span><strong>{connection.status === ConnectionStatus.REQUESTED ? '01' : '00'}</strong><small>{connectionStatusLabels[connection.status]}</small></div>
        <div><span>Token gia sư đang giữ</span><strong>{tokens.held}</strong><small>Phụ huynh không nạp Token</small></div>
        <div><span>Liên hệ mô phỏng</span><strong>{connection.contactUnlocked ? 'Mở' : 'Ẩn'}</strong><small>Chỉ mở sau chấp nhận Buổi 0</small></div>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card dashboard-card--wide">
          <div className="dashboard-card__heading"><h3>Nhu cầu tìm gia sư</h3><span className="neutral-status">Dữ liệu mẫu</span></div>
          <dl className="need-summary">
            <div><dt>Môn học</dt><dd>Toán lớp 9</dd></div>
            <div><dt>Khu vực</dt><dd>Cầu Giấy, Hà Nội</dd></div>
            <div><dt>Lịch mong muốn</dt><dd>Tối Thứ 3 và Thứ 6</dd></div>
            <div><dt>Ngân sách dự kiến</dt><dd>220.000–280.000đ / buổi</dd></div>
          </dl>
          <p>Phụ huynh không đặt cọc hoặc nạp học phí qua nền tảng.</p>
        </section>
        <ConnectionStatusCard actor="parent" />
      </div>

      <DemoChatPanel actor="parent" />
    </DemoDashboardShell>
  )
}

export function TutorPanel() {
  const { state } = useDemo()

  return (
    <DemoDashboardShell
      role="Gia sư"
      title="Không gian gia sư"
      description="Gửi Connect, trao đổi, đề xuất Buổi 0 và theo dõi Token trong cùng reducer."
      navItems={['Tổng quan', 'Hồ sơ', 'Token & kết nối', 'Tin nhắn', 'Hỗ trợ']}
    >
      <div className="dashboard-grid dashboard-grid--tutor">
        <section className="dashboard-card">
          <div className="dashboard-card__heading"><h3>Hồ sơ mẫu</h3><span className="neutral-status">Chưa xác minh</span></div>
          <div className="demo-profile-summary">
            <span aria-hidden="true">GS</span>
            <div><strong>Gia sư mẫu GS-01</strong><small>Toán THCS · Hà Nội</small></div>
          </div>
          <p>Không có giấy tờ hoặc dữ liệu liên hệ thật trong fixture.</p>
        </section>
        <ConnectionStatusCard actor="tutor" />
      </div>

      <TokenStatusPanel />
      <DemoChatPanel actor="tutor" />

      {state.tutor.blocked && (
        <div className="blocked-access-note">
          <strong>Quyền vẫn còn khi bị khóa</strong>
          <span>Lịch sử Token: xem được · Hỗ trợ/giải trình: xem được · Kết nối mới: bị khóa</span>
        </div>
      )}
    </DemoDashboardShell>
  )
}

export function AdminPanel() {
  const { state } = useDemo()

  return (
    <DemoDashboardShell
      role="Admin"
      title="Tổng quan vận hành mẫu"
      description="Công cụ kịch bản tách biệt, không đọc người dùng, session hoặc hồ sơ thật."
      navItems={['Tổng quan', 'Trạng thái demo', 'Công cụ kịch bản', 'Lịch sử Token']}
    >
      <div className="dashboard-stats">
        <div><span>Trạng thái kết nối</span><strong>{state.connection.status}</strong><small>{state.connection.id}</small></div>
        <div><span>Chuỗi hỏng hợp lệ</span><strong>{state.tutor.consecutiveFailures}</strong><small>Không có quy tắc reset tự đặt</small></div>
        <div><span>Khóa nhận kết nối</span><strong>{state.tutor.blocked ? 'Có' : 'Không'}</strong><small>Lịch sử và hỗ trợ vẫn mở</small></div>
      </div>

      <ScenarioTools />
      <TokenStatusPanel />

      <section className="dashboard-card admin-service-card">
        <div className="dashboard-card__heading"><h3>Ranh giới triển khai</h3><span className="neutral-status">Frontend only</span></div>
        <div className="service-table" role="table" aria-label="Trạng thái dịch vụ mô phỏng">
          <div role="row"><span role="cell">Reducer dùng chung</span><strong role="cell">Trong bộ nhớ /demo</strong></div>
          <div role="row"><span role="cell">Backend / MongoDB</span><strong role="cell">Chưa triển khai</strong></div>
          <div role="row"><span role="cell">Auth / RBAC</span><strong role="cell">Chưa triển khai</strong></div>
          <div role="row"><span role="cell">Thanh toán / OCR / SMS</span><strong role="cell">Không tích hợp</strong></div>
        </div>
      </section>
    </DemoDashboardShell>
  )
}
