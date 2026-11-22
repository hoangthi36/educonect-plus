import { ipKeyGenerator, rateLimit } from 'express-rate-limit'
import { normalizeEmail } from '../utils/validation.js'

function handler(_req, res) {
  res.status(429).json({
    error: {
      code: 'RATE_LIMITED',
      message: 'Có quá nhiều yêu cầu. Vui lòng thử lại sau.',
    },
  })
}

function identifierKey(req) {
  const ip = ipKeyGenerator(req.ip)
  const email = normalizeEmail(req.body?.email) || 'missing-email'
  return `${ip}:${email}`
}

export function createLoginLimiter(max) {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: max,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    keyGenerator: identifierKey,
    handler,
  })
}

export function createRegisterLimiter(max) {
  return rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: max,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    keyGenerator: identifierKey,
    handler,
  })
}
