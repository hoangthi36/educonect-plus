export const DemoAction = Object.freeze({
  SET_PERSONA: 'SET_PERSONA',
  RESET_DEMO: 'RESET_DEMO',
  TUTOR_SEND_CONNECT: 'TUTOR_SEND_CONNECT',
  PARENT_ACCEPT_CONNECT: 'PARENT_ACCEPT_CONNECT',
  PARENT_DECLINE_CONNECT: 'PARENT_DECLINE_CONNECT',
  SEND_MESSAGE: 'SEND_MESSAGE',
  TUTOR_PROPOSE_TRIAL: 'TUTOR_PROPOSE_TRIAL',
  PARENT_REJECT_TRIAL_CONTINUE: 'PARENT_REJECT_TRIAL_CONTINUE',
  PARENT_ACCEPT_TRIAL: 'PARENT_ACCEPT_TRIAL',
  CLOSE_BEFORE_TRIAL: 'CLOSE_BEFORE_TRIAL',
  TUTOR_REPORT_FAILURE: 'TUTOR_REPORT_FAILURE',
  SCENARIO_APPROVE_FIRST_FAILURE: 'SCENARIO_APPROVE_FIRST_FAILURE',
  SCENARIO_PREPARE_SECOND_FAILURE: 'SCENARIO_PREPARE_SECOND_FAILURE',
  SCENARIO_CONFIRM_SECOND_FAILURE: 'SCENARIO_CONFIRM_SECOND_FAILURE',
})

export const ConnectionStatus = Object.freeze({
  READY: 'READY',
  REQUESTED: 'REQUESTED',
  DECLINED: 'DECLINED',
  IN_CHAT: 'IN_CHAT',
  TRIAL_PROPOSED: 'TRIAL_PROPOSED',
  TRIAL_ACCEPTED: 'TRIAL_ACCEPTED',
  CLOSED_BEFORE_TRIAL: 'CLOSED_BEFORE_TRIAL',
  FAILURE_REVIEW: 'FAILURE_REVIEW',
  FAILURE_CONFIRMED_FIRST: 'FAILURE_CONFIRMED_FIRST',
  BLOCKED_PENDING_REVIEW: 'BLOCKED_PENDING_REVIEW',
})

export const connectionStatusLabels = Object.freeze({
  [ConnectionStatus.READY]: 'Chưa gửi Connect',
  [ConnectionStatus.REQUESTED]: 'Chờ phụ huynh phản hồi',
  [ConnectionStatus.DECLINED]: 'Connect đã bị từ chối',
  [ConnectionStatus.IN_CHAT]: 'Đang trao đổi',
  [ConnectionStatus.TRIAL_PROPOSED]: 'Đang chờ phản hồi Buổi 0',
  [ConnectionStatus.TRIAL_ACCEPTED]: 'Buổi 0 đã được chấp nhận',
  [ConnectionStatus.CLOSED_BEFORE_TRIAL]: 'Đã đóng trước Buổi 0',
  [ConnectionStatus.FAILURE_REVIEW]: 'Báo hỏng đang chờ xác minh',
  [ConnectionStatus.FAILURE_CONFIRMED_FIRST]: 'Báo hỏng lần đầu đã xác minh',
  [ConnectionStatus.BLOCKED_PENDING_REVIEW]: 'Khóa nhận kết nối · chờ Admin',
})

const VALID_PERSONAS = new Set(['guest', 'parent', 'tutor', 'admin'])
const CHAT_STATUSES = new Set([
  ConnectionStatus.IN_CHAT,
  ConnectionStatus.TRIAL_PROPOSED,
  ConnectionStatus.TRIAL_ACCEPTED,
  ConnectionStatus.FAILURE_REVIEW,
  ConnectionStatus.FAILURE_CONFIRMED_FIRST,
  ConnectionStatus.BLOCKED_PENDING_REVIEW,
])
const CONTACT_LIKE_PATTERN = /(https?:\/\/|www\.|@|\b0\d{8,10}\b|zalo|facebook|fb\.com)/i

function createConnection(id = 'connection-demo-001') {
  return {
    id,
    status: ConnectionStatus.READY,
    contactUnlocked: false,
    holdEventId: null,
    consumedEventId: null,
    activeProposalId: null,
    proposals: [],
    messages: [
      {
        id: `${id}-welcome`,
        sender: 'system',
        text: 'Phòng chat sẽ mở sau khi phụ huynh chấp nhận Connect.',
      },
    ],
    claim: null,
  }
}

export function createInitialDemoState() {
  const connection = createConnection()

  return {
    personaId: 'tutor',
    tokens: {
      available: 2,
      held: 0,
      consumed: 0,
      refunded: 0,
    },
    tutor: {
      blocked: false,
      consecutiveFailures: 0,
      canViewHistory: true,
      canAccessSupport: true,
    },
    connection,
    ledger: [
      {
        id: 'seed-credit-demo',
        type: 'CREDIT_GRANTED',
        connectionId: null,
        deltaAvailable: 2,
        deltaHeld: 0,
        label: 'Cấp 2 Token cho seed mô phỏng — không có thanh toán thật',
      },
    ],
    activity: [
      {
        id: 'seed-activity',
        actor: 'system',
        label: 'Khởi tạo demo với 2 Token khả dụng.',
      },
    ],
    processedEventIds: ['seed-credit-demo'],
    notice: {
      kind: 'info',
      message: 'Demo đã sẵn sàng. Dữ liệu chỉ tồn tại trong bộ nhớ trang.',
    },
  }
}

function hasProcessed(state, action) {
  return Boolean(action.eventId && state.processedEventIds.includes(action.eventId))
}

function recordEvent(state, action) {
  if (!action.eventId || state.processedEventIds.includes(action.eventId)) {
    return state.processedEventIds
  }
  return [...state.processedEventIds, action.eventId]
}

function rejectAction(state, action, message) {
  return {
    ...state,
    processedEventIds: recordEvent(state, action),
    notice: { kind: 'error', message },
  }
}

function completeAction(state, action, changes, message, activityLabel = message) {
  return {
    ...state,
    ...changes,
    processedEventIds: recordEvent(state, action),
    activity: action.eventId
      ? [...state.activity, { id: action.eventId, actor: action.actor ?? 'system', label: activityLabel }]
      : state.activity,
    notice: { kind: 'success', message },
  }
}

function isActor(state, action, actor) {
  return state.personaId === actor && action.actor === actor
}

function updateProposal(proposals, proposalId, patch) {
  return proposals.map((proposal) => (
    proposal.id === proposalId ? { ...proposal, ...patch } : proposal
  ))
}

function ledgerEntry(action, connectionId, type, label, deltas = {}) {
  return {
    id: action.eventId,
    type,
    connectionId,
    deltaAvailable: deltas.deltaAvailable ?? 0,
    deltaHeld: deltas.deltaHeld ?? 0,
    referenceEventId: deltas.referenceEventId ?? null,
    label,
  }
}

export function demoReducer(state, action) {
  if (!state) state = createInitialDemoState()

  if (action.type === DemoAction.RESET_DEMO) {
    return createInitialDemoState()
  }

  if (action.type === DemoAction.SET_PERSONA) {
    if (!VALID_PERSONAS.has(action.personaId)) return state
    return {
      ...state,
      personaId: action.personaId,
      notice: {
        kind: 'info',
        message: 'Đã đổi góc nhìn demo. Số dư và trạng thái kết nối được giữ nguyên.',
      },
    }
  }

  if (hasProcessed(state, action)) return state

  switch (action.type) {
    case DemoAction.TUTOR_SEND_CONNECT: {
      if (!isActor(state, action, 'tutor')) {
        return rejectAction(state, action, 'Chỉ persona gia sư được gửi Connect trong demo.')
      }
      if (state.tutor.blocked) {
        return rejectAction(state, action, 'Gia sư đang bị khóa quyền nhận kết nối mới.')
      }
      if (state.tokens.available < 1) {
        return rejectAction(state, action, 'Không đủ Token khả dụng để bắt đầu một kết nối mới.')
      }
      if (state.connection.status !== ConnectionStatus.READY) {
        return rejectAction(state, action, 'Connect chỉ được gửi một lần ở trạng thái ban đầu.')
      }

      return completeAction(
        state,
        action,
        { connection: { ...state.connection, status: ConnectionStatus.REQUESTED } },
        'Đã gửi Connect. Chưa giữ hoặc trừ Token.',
      )
    }

    case DemoAction.PARENT_ACCEPT_CONNECT: {
      if (!isActor(state, action, 'parent')) {
        return rejectAction(state, action, 'Chỉ persona phụ huynh được chấp nhận Connect.')
      }
      if (state.connection.status !== ConnectionStatus.REQUESTED) {
        return rejectAction(state, action, 'Connect không còn ở trạng thái chờ chấp nhận.')
      }
      if (state.tokens.available < 1 || state.tokens.held !== 0) {
        return rejectAction(state, action, 'Không thể giữ Token: số dư khả dụng không đủ hoặc đã có hold.')
      }

      const entry = ledgerEntry(
        action,
        state.connection.id,
        'HELD',
        'Giữ 1 Token khi phụ huynh chấp nhận Connect',
        { deltaAvailable: -1, deltaHeld: 1 },
      )

      return completeAction(
        state,
        action,
        {
          tokens: { ...state.tokens, available: state.tokens.available - 1, held: state.tokens.held + 1 },
          connection: {
            ...state.connection,
            status: ConnectionStatus.IN_CHAT,
            holdEventId: action.eventId,
            messages: [
              ...state.connection.messages,
              {
                id: `${action.eventId}-system`,
                sender: 'system',
                text: 'Phụ huynh đã chấp nhận Connect. Một Token đang được giữ; liên hệ vẫn bị ẩn.',
              },
            ],
          },
          ledger: [...state.ledger, entry],
        },
        'Đã mở chat và giữ 1 Token.',
      )
    }

    case DemoAction.PARENT_DECLINE_CONNECT: {
      if (!isActor(state, action, 'parent')) {
        return rejectAction(state, action, 'Chỉ persona phụ huynh được từ chối Connect.')
      }
      if (state.connection.status !== ConnectionStatus.REQUESTED) {
        return rejectAction(state, action, 'Connect không còn ở trạng thái chờ phản hồi.')
      }
      return completeAction(
        state,
        action,
        { connection: { ...state.connection, status: ConnectionStatus.DECLINED } },
        'Đã từ chối Connect. Token không thay đổi.',
      )
    }

    case DemoAction.SEND_MESSAGE: {
      if (!['parent', 'tutor'].includes(action.actor) || state.personaId !== action.actor) {
        return rejectAction(state, action, 'Chỉ phụ huynh hoặc gia sư ở đúng góc nhìn được gửi tin nhắn.')
      }
      if (!CHAT_STATUSES.has(state.connection.status)) {
        return rejectAction(state, action, 'Phòng chat chưa mở hoặc kết nối đã đóng.')
      }
      const text = String(action.text ?? '').trim()
      if (!text || text.length > 500) {
        return rejectAction(state, action, 'Tin nhắn phải có từ 1 đến 500 ký tự.')
      }
      if (CONTACT_LIKE_PATTERN.test(text)) {
        return rejectAction(
          state,
          action,
          'Demo không nhận thông tin liên hệ thật. Bộ lọc này chỉ là minh họa, không phải OCR/SMS hay kiểm duyệt hoàn chỉnh.',
        )
      }

      return completeAction(
        state,
        action,
        {
          connection: {
            ...state.connection,
            messages: [
              ...state.connection.messages,
              { id: action.eventId, sender: action.actor, text },
            ],
          },
        },
        'Đã gửi tin nhắn trong bộ nhớ demo.',
        `${action.actor === 'parent' ? 'Phụ huynh' : 'Gia sư'} gửi một tin nhắn demo.`,
      )
    }

    case DemoAction.TUTOR_PROPOSE_TRIAL: {
      if (!isActor(state, action, 'tutor')) {
        return rejectAction(state, action, 'Chỉ persona gia sư được gửi đề xuất Buổi 0.')
      }
      if (state.connection.status !== ConnectionStatus.IN_CHAT || state.tokens.held < 1) {
        return rejectAction(state, action, 'Chỉ có thể đề xuất Buổi 0 khi chat đang mở và Token còn được giữ.')
      }

      const version = state.connection.proposals.length + 1
      const proposal = {
        id: `trial-${state.connection.id}-v${version}`,
        version,
        status: 'PENDING',
        schedule: action.proposal?.schedule ?? '19:00 Thứ 6 tuần này',
        content: action.proposal?.content ?? 'Khảo sát kiến thức Toán lớp 9 và thống nhất lộ trình',
        location: action.proposal?.location ?? 'Khu vực Cầu Giấy, Hà Nội',
        fee: action.proposal?.fee ?? 'Chi phí dạy thử do hai bên thỏa thuận',
      }

      return completeAction(
        state,
        action,
        {
          connection: {
            ...state.connection,
            status: ConnectionStatus.TRIAL_PROPOSED,
            activeProposalId: proposal.id,
            proposals: [...state.connection.proposals, proposal],
          },
        },
        'Đã gửi đề xuất Buổi 0. Token đang giữ không thay đổi.',
      )
    }

    case DemoAction.PARENT_REJECT_TRIAL_CONTINUE: {
      if (!isActor(state, action, 'parent')) {
        return rejectAction(state, action, 'Chỉ persona phụ huynh được phản hồi đề xuất Buổi 0.')
      }
      const activeProposal = state.connection.proposals.find(
        (proposal) => proposal.id === state.connection.activeProposalId,
      )
      if (
        state.connection.status !== ConnectionStatus.TRIAL_PROPOSED
        || !activeProposal
        || activeProposal.status !== 'PENDING'
      ) {
        return rejectAction(state, action, 'Không có đề xuất Buổi 0 đang chờ để từ chối.')
      }

      return completeAction(
        state,
        action,
        {
          connection: {
            ...state.connection,
            status: ConnectionStatus.IN_CHAT,
            activeProposalId: null,
            proposals: updateProposal(
              state.connection.proposals,
              activeProposal.id,
              { status: 'REJECTED_CONTINUE' },
            ),
          },
        },
        'Đã từ chối đề xuất nhưng vẫn tiếp tục thương lượng. Token tiếp tục được giữ.',
      )
    }

    case DemoAction.PARENT_ACCEPT_TRIAL: {
      if (!isActor(state, action, 'parent')) {
        return rejectAction(state, action, 'Chỉ persona phụ huynh được chấp nhận Buổi 0.')
      }
      const activeProposal = state.connection.proposals.find(
        (proposal) => proposal.id === state.connection.activeProposalId,
      )
      if (
        state.connection.status !== ConnectionStatus.TRIAL_PROPOSED
        || !activeProposal
        || activeProposal.id !== action.proposalId
        || activeProposal.status !== 'PENDING'
        || state.tokens.held < 1
      ) {
        return rejectAction(state, action, 'Đề xuất không hợp lệ, đã hủy hoặc không còn Token đang giữ.')
      }

      const entry = ledgerEntry(
        action,
        state.connection.id,
        'CONSUMED',
        `Dùng hold khi phụ huynh chấp nhận Buổi 0 phiên bản ${activeProposal.version}`,
        { deltaAvailable: 0, deltaHeld: -1, referenceEventId: state.connection.holdEventId },
      )

      return completeAction(
        state,
        action,
        {
          tokens: {
            ...state.tokens,
            held: state.tokens.held - 1,
            consumed: state.tokens.consumed + 1,
          },
          connection: {
            ...state.connection,
            status: ConnectionStatus.TRIAL_ACCEPTED,
            contactUnlocked: true,
            consumedEventId: action.eventId,
            activeProposalId: null,
            proposals: updateProposal(
              state.connection.proposals,
              activeProposal.id,
              { status: 'ACCEPTED' },
            ),
            messages: [
              ...state.connection.messages,
              {
                id: `${action.eventId}-system`,
                sender: 'system',
                text: 'Buổi 0 đã được chấp nhận. Hold đã được dùng một lần và liên hệ mô phỏng đã mở.',
              },
            ],
          },
          ledger: [...state.ledger, entry],
        },
        'Đã chấp nhận Buổi 0, dùng 1 Token và mở liên hệ mô phỏng.',
      )
    }

    case DemoAction.CLOSE_BEFORE_TRIAL: {
      if (!['parent', 'tutor'].includes(action.actor) || state.personaId !== action.actor) {
        return rejectAction(state, action, 'Chỉ phụ huynh hoặc gia sư trong kết nối được đóng phiên.')
      }
      if (
        ![ConnectionStatus.IN_CHAT, ConnectionStatus.TRIAL_PROPOSED].includes(state.connection.status)
        || state.tokens.held < 1
      ) {
        return rejectAction(state, action, 'Chỉ có thể đóng và trả hold trước khi Buổi 0 được chấp nhận.')
      }

      const entry = ledgerEntry(
        action,
        state.connection.id,
        'RELEASED',
        'Trả Token đang giữ khi đóng kết nối trước Buổi 0',
        { deltaAvailable: 1, deltaHeld: -1, referenceEventId: state.connection.holdEventId },
      )
      const proposals = state.connection.activeProposalId
        ? updateProposal(
          state.connection.proposals,
          state.connection.activeProposalId,
          { status: 'CANCELLED_WITH_CONNECTION' },
        )
        : state.connection.proposals

      return completeAction(
        state,
        action,
        {
          tokens: {
            ...state.tokens,
            available: state.tokens.available + 1,
            held: state.tokens.held - 1,
          },
          connection: {
            ...state.connection,
            status: ConnectionStatus.CLOSED_BEFORE_TRIAL,
            contactUnlocked: false,
            activeProposalId: null,
            proposals,
          },
          ledger: [...state.ledger, entry],
        },
        'Đã đóng kết nối và trả Token đang giữ. Không tăng số lần lớp hỏng.',
      )
    }

    case DemoAction.TUTOR_REPORT_FAILURE: {
      if (!isActor(state, action, 'tutor')) {
        return rejectAction(state, action, 'Chỉ persona gia sư được gửi báo hỏng trong demo.')
      }
      if (state.connection.status !== ConnectionStatus.TRIAL_ACCEPTED || state.connection.claim) {
        return rejectAction(state, action, 'Báo hỏng chỉ được gửi một lần sau khi Buổi 0 đã được chấp nhận.')
      }

      const attemptNumber = state.tutor.consecutiveFailures + 1
      return completeAction(
        state,
        action,
        {
          connection: {
            ...state.connection,
            status: ConnectionStatus.FAILURE_REVIEW,
            claim: {
              id: `claim-${state.connection.id}`,
              status: 'PENDING_VERIFICATION',
              attemptNumber,
              consumptionEventId: state.connection.consumedEventId,
              refundIssued: false,
              reason: action.reason ?? 'Hai bên không tiếp tục sau Buổi 0',
              evidence: 'Mô tả fixture — không nhận tệp hoặc giấy tờ thật',
            },
          },
        },
        'Đã gửi yêu cầu báo hỏng. Trạng thái đang chờ xác minh, chưa hoàn Token.',
      )
    }

    case DemoAction.SCENARIO_APPROVE_FIRST_FAILURE: {
      if (!isActor(state, action, 'admin')) {
        return rejectAction(state, action, 'Chỉ công cụ kịch bản Admin mới mô phỏng kết quả xác minh.')
      }
      const claim = state.connection.claim
      const alreadyRefunded = state.ledger.some(
        (entry) => entry.type === 'REFUNDED' && entry.referenceEventId === claim?.consumptionEventId,
      )
      if (
        state.connection.status !== ConnectionStatus.FAILURE_REVIEW
        || !claim
        || claim.status !== 'PENDING_VERIFICATION'
        || claim.attemptNumber !== 1
        || state.tutor.consecutiveFailures !== 0
        || claim.refundIssued
        || alreadyRefunded
      ) {
        return rejectAction(state, action, 'Không có báo hỏng lần đầu hợp lệ đang chờ hoặc Token đã được hoàn.')
      }

      const entry = ledgerEntry(
        action,
        state.connection.id,
        'REFUNDED',
        'Hoàn 1 Token sau fixture xác minh hợp lệ lần đầu',
        { deltaAvailable: 1, deltaHeld: 0, referenceEventId: claim.consumptionEventId },
      )

      return completeAction(
        state,
        action,
        {
          tokens: {
            ...state.tokens,
            available: state.tokens.available + 1,
            refunded: state.tokens.refunded + 1,
          },
          tutor: { ...state.tutor, consecutiveFailures: 1 },
          connection: {
            ...state.connection,
            status: ConnectionStatus.FAILURE_CONFIRMED_FIRST,
            claim: { ...claim, status: 'FAILURE_CONFIRMED_FIRST', refundIssued: true },
          },
          ledger: [...state.ledger, entry],
        },
        'Fixture lần đầu hợp lệ: đã hoàn đúng 1 Token.',
      )
    }

    case DemoAction.SCENARIO_PREPARE_SECOND_FAILURE: {
      if (!isActor(state, action, 'admin')) {
        return rejectAction(state, action, 'Chỉ công cụ kịch bản Admin được dựng tình huống lần hai.')
      }
      if (
        state.connection.status !== ConnectionStatus.FAILURE_CONFIRMED_FIRST
        || state.tutor.consecutiveFailures !== 1
        || state.tutor.blocked
        || state.tokens.available < 1
      ) {
        return rejectAction(state, action, 'Cần hoàn tất fixture hỏng lần đầu và còn Token khả dụng trước khi dựng lần hai.')
      }

      const connection = createConnection('connection-demo-002')
      const holdId = `${action.eventId}-held`
      const consumeId = `${action.eventId}-consumed`
      const proposalId = 'trial-connection-demo-002-v1'
      const preparedConnection = {
        ...connection,
        status: ConnectionStatus.FAILURE_REVIEW,
        contactUnlocked: true,
        holdEventId: holdId,
        consumedEventId: consumeId,
        proposals: [
          {
            id: proposalId,
            version: 1,
            status: 'ACCEPTED',
            schedule: 'Kịch bản Buổi 0 thứ hai',
            content: 'Fixture do công cụ kịch bản chuẩn bị',
            location: 'Khu vực mô phỏng',
            fee: 'Chi phí dạy thử do hai bên thỏa thuận',
          },
        ],
        messages: [
          {
            id: `${action.eventId}-system`,
            sender: 'system',
            text: 'Công cụ kịch bản đã chuẩn bị một kết nối thứ hai ở trạng thái chờ xác minh báo hỏng.',
          },
        ],
        claim: {
          id: 'claim-connection-demo-002',
          status: 'PENDING_VERIFICATION',
          attemptNumber: 2,
          consumptionEventId: consumeId,
          refundIssued: false,
          reason: 'Fixture hỏng lần hai liên tiếp',
          evidence: 'Mô tả fixture — không nhận tệp hoặc giấy tờ thật',
        },
      }
      const heldEntry = {
        id: holdId,
        type: 'HELD',
        connectionId: connection.id,
        deltaAvailable: -1,
        deltaHeld: 1,
        referenceEventId: null,
        label: 'Công cụ kịch bản dựng hold cho kết nối thứ hai',
      }
      const consumedEntry = {
        id: consumeId,
        type: 'CONSUMED',
        connectionId: connection.id,
        deltaAvailable: 0,
        deltaHeld: -1,
        referenceEventId: holdId,
        label: 'Công cụ kịch bản dựng consumption cho kết nối thứ hai',
      }

      return completeAction(
        state,
        action,
        {
          tokens: {
            ...state.tokens,
            available: state.tokens.available - 1,
            consumed: state.tokens.consumed + 1,
          },
          connection: preparedConnection,
          ledger: [...state.ledger, heldEntry, consumedEntry],
        },
        'Đã dựng fixture báo hỏng lần hai ở trạng thái chờ xác minh. Chưa khóa và chưa hoàn Token.',
      )
    }

    case DemoAction.SCENARIO_CONFIRM_SECOND_FAILURE: {
      if (!isActor(state, action, 'admin')) {
        return rejectAction(state, action, 'Chỉ công cụ kịch bản Admin mới mô phỏng xác minh lần hai.')
      }
      const claim = state.connection.claim
      if (
        state.connection.status !== ConnectionStatus.FAILURE_REVIEW
        || !claim
        || claim.status !== 'PENDING_VERIFICATION'
        || claim.attemptNumber !== 2
        || state.tutor.consecutiveFailures !== 1
        || state.tutor.blocked
      ) {
        return rejectAction(state, action, 'Không có báo hỏng lần hai hợp lệ đang chờ Admin.')
      }

      return completeAction(
        state,
        action,
        {
          tutor: { ...state.tutor, consecutiveFailures: 2, blocked: true },
          connection: {
            ...state.connection,
            status: ConnectionStatus.BLOCKED_PENDING_REVIEW,
            claim: { ...claim, status: 'BLOCKED_PENDING_REVIEW' },
          },
        },
        'Fixture lần hai hợp lệ: đã khóa nhận kết nối mới, không tự hoàn Token lần hai.',
      )
    }

    default:
      return state
  }
}
