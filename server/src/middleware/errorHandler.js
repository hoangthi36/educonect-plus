import { HttpError } from '../utils/httpError.js'

export function notFoundApi(_req, res) {
  res.status(404).json({ error: { code: 'API_NOT_FOUND', message: 'API không tồn tại.' } })
}

export function errorHandler(error, _req, res, _next) {
  if (error instanceof HttpError) {
    const payload = { code: error.code, message: error.message }
    if (error.fields) payload.fields = error.fields
    return res.status(error.status).json({ error: payload })
  }

  if (error?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { code: 'INVALID_JSON', message: 'JSON không hợp lệ.' } })
  }

  if (error?.code === 11000) {
    return res.status(409).json({
      error: { code: 'EMAIL_EXISTS', message: 'Email đã được sử dụng.' },
    })
  }

  const databaseUnavailable = [
    'MongoServerSelectionError',
    'MongoNetworkError',
  ].includes(error?.name)

  if (process.env.NODE_ENV !== 'test') {
    console.error(databaseUnavailable ? 'Database unavailable.' : 'Unhandled server error.')
  }

  return res.status(databaseUnavailable ? 503 : 500).json({
    error: {
      code: databaseUnavailable ? 'DATABASE_UNAVAILABLE' : 'INTERNAL_ERROR',
      message: databaseUnavailable
        ? 'Cơ sở dữ liệu tạm thời không khả dụng.'
        : 'Máy chủ gặp lỗi. Vui lòng thử lại sau.',
    },
  })
}
