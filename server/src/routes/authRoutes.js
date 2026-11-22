import { Router } from 'express'
import User from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { createLoginLimiter, createRegisterLimiter } from '../middleware/rateLimits.js'
import { issueCsrfToken } from '../middleware/security.js'
import { HttpError } from '../utils/httpError.js'
import { hashPassword, verifyPassword } from '../utils/password.js'
import { toSafeUser } from '../utils/safeUser.js'
import { validateLogin, validateRegistration } from '../utils/validation.js'

function regenerateSession(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => (error ? reject(error) : resolve()))
  })
}

function saveSession(req) {
  return new Promise((resolve, reject) => {
    req.session.save((error) => (error ? reject(error) : resolve()))
  })
}

function destroySession(req) {
  return new Promise((resolve, reject) => {
    req.session.destroy((error) => (error ? reject(error) : resolve()))
  })
}

export function createAuthRouter({ config, mutationProtection }) {
  const router = Router()
  const loginLimiter = createLoginLimiter(config.loginRateLimitMax)
  const registerLimiter = createRegisterLimiter(config.registerRateLimitMax)

  router.get('/csrf', (req, res) => {
    res.json({ csrfToken: issueCsrfToken(req) })
  })

  router.post('/register', mutationProtection, registerLimiter, asyncHandler(async (req, res) => {
    const input = validateRegistration(req.body)
    const existing = await User.exists({ emailNormalized: input.email })
    if (existing) throw new HttpError(409, 'EMAIL_EXISTS', 'Email đã được sử dụng.')

    const user = await User.create({
      name: input.name,
      emailNormalized: input.email,
      passwordHash: await hashPassword(input.password),
      role: input.role,
    })

    res.status(201).json({ user: toSafeUser(user) })
  }))

  router.post('/login', mutationProtection, loginLimiter, asyncHandler(async (req, res) => {
    const input = validateLogin(req.body)
    const user = await User.findOne({ emailNormalized: input.email }).select('+passwordHash')
    const matches = user ? await verifyPassword(user.passwordHash, input.password) : false

    if (!matches || user.accountStatus !== 'active') {
      throw new HttpError(401, 'INVALID_CREDENTIALS', 'Email hoặc mật khẩu không đúng.')
    }

    await regenerateSession(req)
    req.session.userId = user.id
    await saveSession(req)

    res.json({ user: toSafeUser(user) })
  }))

  router.get('/me', requireAuth, (req, res) => {
    res.json({ user: toSafeUser(req.authUser) })
  })

  router.post('/logout', mutationProtection, asyncHandler(async (req, res) => {
    await destroySession(req)
    res.clearCookie(config.sessionCookieName, {
      httpOnly: true,
      sameSite: 'lax',
      secure: config.production,
      path: '/',
    })
    res.status(204).end()
  }))

  return router
}
