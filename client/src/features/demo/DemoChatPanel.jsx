import { useState } from 'react'
import { useDemo } from './DemoStore.jsx'
import { ConnectionStatus, connectionStatusLabels, DemoAction } from './demoReducer.js'

const CHAT_VISIBLE_STATUSES = new Set([
  ConnectionStatus.IN_CHAT,
  ConnectionStatus.TRIAL_PROPOSED,
  ConnectionStatus.TRIAL_ACCEPTED,
  ConnectionStatus.FAILURE_REVIEW,
  ConnectionStatus.FAILURE_CONFIRMED_FIRST,
  ConnectionStatus.BLOCKED_PENDING_REVIEW,
])

const proposalStatusLabels = {
  PENDING: 'Chờ phụ huynh phản hồi',
  ACCEPTED: 'Đã chấp nhận',
  REJECTED_CONTINUE: 'Đã từ chối · tiếp tục thương lượng',
  CANCELLED_WITH_CONNECTION: 'Đã hủy cùng kết nối',
}

function DemoChatPanel({ actor }) {
  const { state, send } = useDemo()
  const [message, setMessage] = useState('')
  const { connection } = state
  const latestProposal = connection.proposals.at(-1)

  if (!CHAT_VISIBLE_STATUSES.has(connection.status)) return null

  const submitMessage = (event) => {
    event.preventDefault()
    const text = message.trim()
    if (!text) return
    send(DemoAction.SEND_MESSAGE, { actor, text })
    setMessage('')
  }

  const acceptTrial = () => {
    if (!connection.activeProposalId) return
    send(DemoAction.PARENT_ACCEPT_TRIAL, {
      actor: 'parent',
      proposalId: connection.activeProposalId,
    })
  }

  return (
    <section className="demo-chat" aria-labelledby="demo-chat-title">
      <aside className="demo-chat__contacts">
        <span className="demo-chat__caption">Cuộc trò chuyện</span>
        <div className="demo-chat__contact is-active">
          <span aria-hidden="true">{actor === 'parent' ? 'GS' : 'PH'}</span>
          <div>
            <strong>{actor === 'parent' ? 'Gia sư mẫu GS-01' : 'Phụ huynh mẫu PH-01'}</strong>
            <small>{connectionStatusLabels[connection.status]}</small>
          </div>
        </div>
      </aside>

      <div className="demo-chat__room">
        <header className="demo-chat__header">
          <div>
            <span className="eyebrow">Chat trong bộ nhớ</span>
            <h3 id="demo-chat-title">Trao đổi về Toán lớp 9</h3>
          </div>
          <span className="neutral-status">{connectionStatusLabels[connection.status]}</span>
        </header>

        <div className={`contact-banner ${connection.contactUnlocked ? 'contact-banner--open' : ''}`}>
          {connection.contactUnlocked ? (
            <>
              <strong>Liên hệ mô phỏng đã mở cho đúng cặp</strong>
              <span>SĐT mô phỏng: 09xx xxx xxx · Điểm học mô phỏng A, Cầu Giấy</span>
            </>
          ) : (
            <>
              <strong>Liên hệ vẫn được giữ kín</strong>
              <span>Chỉ mở sau khi phụ huynh chấp nhận đúng đề xuất Buổi 0.</span>
            </>
          )}
        </div>

        <div className="demo-chat__messages" aria-live="polite">
          {connection.messages.map((item) => (
            <div className={`chat-message chat-message--${item.sender}`} key={item.id}>
              <span>{item.sender === 'system' ? 'Hệ thống demo' : item.sender === 'parent' ? 'Phụ huynh' : 'Gia sư'}</span>
              <p>{item.text}</p>
            </div>
          ))}

          {latestProposal && (
            <article className="trial-proposal-card">
              <div className="trial-proposal-card__heading">
                <div><span>Đề xuất Buổi 0 · phiên bản {latestProposal.version}</span><h4>{latestProposal.content}</h4></div>
                <strong>{proposalStatusLabels[latestProposal.status]}</strong>
              </div>
              <dl>
                <div><dt>Thời gian</dt><dd>{latestProposal.schedule}</dd></div>
                <div><dt>Khu vực</dt><dd>{latestProposal.location}</dd></div>
                <div><dt>Chi phí</dt><dd>{latestProposal.fee}</dd></div>
              </dl>
              {actor === 'parent' && latestProposal.status === 'PENDING' && (
                <div className="trial-proposal-card__actions">
                  <button className="button button--primary button--small" type="button" onClick={acceptTrial}>
                    Chấp nhận Buổi 0
                  </button>
                  <button
                    className="button button--outline button--small"
                    type="button"
                    onClick={() => send(DemoAction.PARENT_REJECT_TRIAL_CONTINUE, { actor: 'parent' })}
                  >
                    Từ chối, tiếp tục trao đổi
                  </button>
                </div>
              )}
            </article>
          )}
        </div>

        <form className="demo-chat__composer" onSubmit={submitMessage}>
          <label htmlFor={`demo-message-${actor}`}>Tin nhắn demo</label>
          <div>
            <input
              id={`demo-message-${actor}`}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={500}
              placeholder="Nhập nội dung không chứa dữ liệu cá nhân thật"
            />
            <button className="button button--secondary" type="submit">Gửi tin nhắn</button>
          </div>
          <small>React hiển thị dưới dạng văn bản. Bộ lọc liên hệ chỉ là minh họa, không có OCR hoặc SMS.</small>
        </form>
      </div>
    </section>
  )
}

export default DemoChatPanel
