import { randomBytes, timingSafeEqual } from 'node:crypto'
import { HttpError } from '../utils/httpError.js'

function equalTokens(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string') return false
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer)
}

export function issueCsrfToken(req) {
  if (!req.session.csrfToken) {
    req.session.csrfToken = randomBytes(32).toString('base64url')
  }
  return req.session.csrfToken
}

export function createMutationProtection(appOrigin) {
  return function mutationProtection(req, _res, next) {
    const origin = req.get('origin')
    if (!origin || origin !== appOrigin) {
      return next(new HttpError(403, 'ORIGIN_REJECTED', 'Nguồn gửi yêu cầu không hợp lệ.'))
    }
    if (!equalTokens(req.get('x-csrf-token'), req.session?.csrfToken)) {
      return next(new HttpError(403, 'CSRF_REJECTED', 'CSRF token không hợp lệ hoặc đã hết hạn.'))
    }
    return next()
  }
}
