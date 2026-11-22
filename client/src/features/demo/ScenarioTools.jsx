import { useDemo } from './DemoStore.jsx'
import { ConnectionStatus, DemoAction } from './demoReducer.js'

function ScenarioTools() {
  const { state, send } = useDemo()
  const claim = state.connection.claim
  const canApproveFirst = (
    state.connection.status === ConnectionStatus.FAILURE_REVIEW
    && claim?.attemptNumber === 1
    && claim.status === 'PENDING_VERIFICATION'
  )
  const canPrepareSecond = (
    state.connection.status === ConnectionStatus.FAILURE_CONFIRMED_FIRST
    && state.tutor.consecutiveFailures === 1
    && !state.tutor.blocked
  )
  const canConfirmSecond = (
    state.connection.status === ConnectionStatus.FAILURE_REVIEW
    && claim?.attemptNumber === 2
    && claim.status === 'PENDING_VERIFICATION'
  )

  return (
    <section className="scenario-tools" aria-labelledby="scenario-tools-title">
      <div className="scenario-tools__heading">
        <div>
          <span className="scenario-tools__badge">Công cụ kịch bản riêng</span>
          <h3 id="scenario-tools-title">Mô phỏng kết quả xác minh</h3>
        </div>
        <strong>Không phải quyền của người dùng</strong>
      </div>
      <p>
        Các nút này chỉ dựng fixture cho phần báo cáo. Phụ huynh và gia sư không thể tự hoàn Token
        hoặc tự quyết định kết quả xác minh.
      </p>

      <div className="scenario-tools__status">
        <div><span>Báo hỏng hiện tại</span><strong>{claim ? `Lần ${claim.attemptNumber} · ${claim.status}` : 'Chưa có'}</strong></div>
        <div><span>Chuỗi hỏng hợp lệ</span><strong>{state.tutor.consecutiveFailures}</strong></div>
        <div><span>Khóa nhận kết nối</span><strong>{state.tutor.blocked ? 'Đang khóa' : 'Không'}</strong></div>
      </div>

      <div className="scenario-tools__actions">
        <button
          className="button button--secondary"
          type="button"
          disabled={!canApproveFirst}
          onClick={() => send(DemoAction.SCENARIO_APPROVE_FIRST_FAILURE, { actor: 'admin' })}
        >
          Xác minh hợp lệ lần đầu
        </button>
        <button
          className="button button--outline"
          type="button"
          disabled={!canPrepareSecond}
          onClick={() => send(DemoAction.SCENARIO_PREPARE_SECOND_FAILURE, { actor: 'admin' })}
        >
          Chuẩn bị báo hỏng lần hai
        </button>
        <button
          className="button button--danger"
          type="button"
          disabled={!canConfirmSecond}
          onClick={() => send(DemoAction.SCENARIO_CONFIRM_SECOND_FAILURE, { actor: 'admin' })}
        >
          Xác minh hợp lệ lần hai
        </button>
      </div>
      <small>Không có action reset chuỗi hỏng vì quy tắc này chưa được chốt.</small>
    </section>
  )
}

export default ScenarioTools
