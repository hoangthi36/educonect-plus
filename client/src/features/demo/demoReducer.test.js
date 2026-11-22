import assert from 'node:assert/strict'
import test from 'node:test'
import {
  ConnectionStatus,
  createInitialDemoState,
  DemoAction,
  demoReducer,
} from './demoReducer.js'

function apply(state, type, eventId, payload = {}) {
  return demoReducer(state, { type, eventId, ...payload })
}

function setPersona(state, personaId) {
  return demoReducer(state, { type: DemoAction.SET_PERSONA, personaId })
}

function reachChat() {
  let state = createInitialDemoState()
  state = apply(state, DemoAction.TUTOR_SEND_CONNECT, 'send-connect', { actor: 'tutor' })
  state = setPersona(state, 'parent')
  state = apply(state, DemoAction.PARENT_ACCEPT_CONNECT, 'accept-connect', { actor: 'parent' })
  return state
}

function reachTrialAccepted() {
  let state = reachChat()
  state = setPersona(state, 'tutor')
  state = apply(state, DemoAction.TUTOR_PROPOSE_TRIAL, 'propose-trial', { actor: 'tutor' })
  const proposalId = state.connection.activeProposalId
  state = setPersona(state, 'parent')
  state = apply(state, DemoAction.PARENT_ACCEPT_TRIAL, 'accept-trial', { actor: 'parent', proposalId })
  return state
}

test('Connect không giữ Token; phụ huynh chấp nhận mới hold và persona đổi không reset state', () => {
  let state = createInitialDemoState()
  state = apply(state, DemoAction.TUTOR_SEND_CONNECT, 'connect-1', { actor: 'tutor' })
  assert.deepEqual(state.tokens, { available: 2, held: 0, consumed: 0, refunded: 0 })
  assert.equal(state.connection.status, ConnectionStatus.REQUESTED)

  state = setPersona(state, 'parent')
  state = apply(state, DemoAction.PARENT_ACCEPT_CONNECT, 'hold-1', { actor: 'parent' })
  assert.deepEqual(state.tokens, { available: 1, held: 1, consumed: 0, refunded: 0 })

  state = setPersona(state, 'tutor')
  assert.deepEqual(state.tokens, { available: 1, held: 1, consumed: 0, refunded: 0 })
  assert.equal(state.connection.status, ConnectionStatus.IN_CHAT)
})

test('hold và release không lặp dù action được gửi lại với event khác', () => {
  let state = reachChat()
  const heldLedgerSize = state.ledger.length
  state = apply(state, DemoAction.PARENT_ACCEPT_CONNECT, 'hold-resubmit', { actor: 'parent' })
  assert.deepEqual(state.tokens, { available: 1, held: 1, consumed: 0, refunded: 0 })
  assert.equal(state.ledger.length, heldLedgerSize)

  state = apply(state, DemoAction.CLOSE_BEFORE_TRIAL, 'release-once', { actor: 'parent' })
  const releasedLedgerSize = state.ledger.length
  state = apply(state, DemoAction.CLOSE_BEFORE_TRIAL, 'release-resubmit', { actor: 'parent' })
  assert.deepEqual(state.tokens, { available: 2, held: 0, consumed: 0, refunded: 0 })
  assert.equal(state.ledger.length, releasedLedgerSize)
})

test('tin nhắn trong bộ nhớ giữ nguyên khi đổi persona và event lặp không tạo bản sao', () => {
  let state = reachChat()
  state = apply(state, DemoAction.SEND_MESSAGE, 'message-1', {
    actor: 'parent',
    text: 'Mình muốn trao đổi thêm về mục tiêu học.',
  })
  const messageCount = state.connection.messages.length
  state = setPersona(state, 'tutor')
  assert.equal(state.connection.messages.at(-1).text, 'Mình muốn trao đổi thêm về mục tiêu học.')

  const duplicate = apply(state, DemoAction.SEND_MESSAGE, 'message-1', {
    actor: 'parent',
    text: 'Mình muốn trao đổi thêm về mục tiêu học.',
  })
  assert.strictEqual(duplicate, state)
  assert.equal(duplicate.connection.messages.length, messageCount)
})

test('đề xuất Buổi 0 không trừ thêm; chấp nhận consume hold đúng một lần', () => {
  let state = reachChat()
  state = setPersona(state, 'tutor')
  state = apply(state, DemoAction.TUTOR_PROPOSE_TRIAL, 'proposal-1', { actor: 'tutor' })
  const proposalId = state.connection.activeProposalId
  assert.deepEqual(state.tokens, { available: 1, held: 1, consumed: 0, refunded: 0 })

  state = setPersona(state, 'parent')
  state = apply(state, DemoAction.PARENT_ACCEPT_TRIAL, 'consume-1', { actor: 'parent', proposalId })
  assert.deepEqual(state.tokens, { available: 1, held: 0, consumed: 1, refunded: 0 })
  assert.equal(state.connection.contactUnlocked, true)

  const ledgerSize = state.ledger.length
  const duplicate = apply(state, DemoAction.PARENT_ACCEPT_TRIAL, 'consume-1', { actor: 'parent', proposalId })
  assert.strictEqual(duplicate, state)

  const resubmitted = apply(state, DemoAction.PARENT_ACCEPT_TRIAL, 'consume-2', { actor: 'parent', proposalId })
  assert.deepEqual(resubmitted.tokens, state.tokens)
  assert.equal(resubmitted.ledger.length, ledgerSize)
})

test('hủy trước Buổi 0 release hold, không tăng failure và đề xuất đã hủy không mở liên hệ', () => {
  let state = reachChat()
  state = setPersona(state, 'tutor')
  state = apply(state, DemoAction.TUTOR_PROPOSE_TRIAL, 'proposal-close', { actor: 'tutor' })
  const proposalId = state.connection.activeProposalId
  state = apply(state, DemoAction.CLOSE_BEFORE_TRIAL, 'release-1', { actor: 'tutor' })

  assert.deepEqual(state.tokens, { available: 2, held: 0, consumed: 0, refunded: 0 })
  assert.equal(state.tutor.consecutiveFailures, 0)
  assert.equal(state.connection.contactUnlocked, false)
  assert.equal(state.connection.status, ConnectionStatus.CLOSED_BEFORE_TRIAL)

  state = setPersona(state, 'parent')
  const staleAccept = apply(state, DemoAction.PARENT_ACCEPT_TRIAL, 'stale-consume', { actor: 'parent', proposalId })
  assert.equal(staleAccept.connection.contactUnlocked, false)
  assert.equal(staleAccept.tokens.consumed, 0)
})

test('từ chối Buổi 0 nhưng tiếp tục thương lượng giữ nguyên hold', () => {
  let state = reachChat()
  state = setPersona(state, 'tutor')
  state = apply(state, DemoAction.TUTOR_PROPOSE_TRIAL, 'proposal-reject', { actor: 'tutor' })
  state = setPersona(state, 'parent')
  state = apply(state, DemoAction.PARENT_REJECT_TRIAL_CONTINUE, 'reject-continue', { actor: 'parent' })

  assert.equal(state.connection.status, ConnectionStatus.IN_CHAT)
  assert.deepEqual(state.tokens, { available: 1, held: 1, consumed: 0, refunded: 0 })
})

test('không đủ available thì không hold và mọi số dư luôn không âm', () => {
  let state = createInitialDemoState()
  state = {
    ...state,
    personaId: 'parent',
    tokens: { ...state.tokens, available: 0 },
    connection: { ...state.connection, status: ConnectionStatus.REQUESTED },
  }
  state = apply(state, DemoAction.PARENT_ACCEPT_CONNECT, 'insufficient-hold', { actor: 'parent' })

  assert.deepEqual(state.tokens, { available: 0, held: 0, consumed: 0, refunded: 0 })
  assert.ok(Object.values(state.tokens).every((value) => value >= 0))
  assert.equal(state.connection.status, ConnectionStatus.REQUESTED)
})

test('action sai persona không làm thay đổi kết nối hoặc Token', () => {
  const state = createInitialDemoState()
  const invalid = apply(state, DemoAction.PARENT_ACCEPT_CONNECT, 'wrong-persona', { actor: 'parent' })

  assert.equal(invalid.connection.status, ConnectionStatus.READY)
  assert.deepEqual(invalid.tokens, state.tokens)
})

test('báo hỏng chờ xác minh; lần đầu refund đúng một lần', () => {
  let state = reachTrialAccepted()
  state = setPersona(state, 'tutor')
  state = apply(state, DemoAction.TUTOR_REPORT_FAILURE, 'claim-first', { actor: 'tutor' })
  assert.equal(state.connection.status, ConnectionStatus.FAILURE_REVIEW)
  assert.deepEqual(state.tokens, { available: 1, held: 0, consumed: 1, refunded: 0 })

  state = setPersona(state, 'admin')
  state = apply(state, DemoAction.SCENARIO_APPROVE_FIRST_FAILURE, 'refund-first', { actor: 'admin' })
  assert.deepEqual(state.tokens, { available: 2, held: 0, consumed: 1, refunded: 1 })
  assert.equal(state.tutor.consecutiveFailures, 1)

  const ledgerSize = state.ledger.length
  state = apply(state, DemoAction.SCENARIO_APPROVE_FIRST_FAILURE, 'refund-first-again', { actor: 'admin' })
  assert.deepEqual(state.tokens, { available: 2, held: 0, consumed: 1, refunded: 1 })
  assert.equal(state.ledger.length, ledgerSize)
})

test('lần hỏng thứ hai khóa nhận mới, không tự refund và vẫn giữ lịch sử/hỗ trợ', () => {
  let state = reachTrialAccepted()
  state = setPersona(state, 'tutor')
  state = apply(state, DemoAction.TUTOR_REPORT_FAILURE, 'claim-1', { actor: 'tutor' })
  state = setPersona(state, 'admin')
  state = apply(state, DemoAction.SCENARIO_APPROVE_FIRST_FAILURE, 'refund-1', { actor: 'admin' })
  state = apply(state, DemoAction.SCENARIO_PREPARE_SECOND_FAILURE, 'prepare-2', { actor: 'admin' })

  assert.equal(state.connection.claim.attemptNumber, 2)
  assert.equal(state.connection.status, ConnectionStatus.FAILURE_REVIEW)
  assert.deepEqual(state.tokens, { available: 1, held: 0, consumed: 2, refunded: 1 })

  state = apply(state, DemoAction.SCENARIO_CONFIRM_SECOND_FAILURE, 'confirm-2', { actor: 'admin' })
  assert.equal(state.tutor.blocked, true)
  assert.equal(state.tutor.consecutiveFailures, 2)
  assert.deepEqual(state.tokens, { available: 1, held: 0, consumed: 2, refunded: 1 })
  assert.equal(state.tutor.canViewHistory, true)
  assert.equal(state.tutor.canAccessSupport, true)
  assert.equal(state.ledger.filter((entry) => entry.type === 'REFUNDED').length, 1)
})
