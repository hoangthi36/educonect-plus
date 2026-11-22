import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import MongoStore from 'connect-mongo'
import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { connectDatabase, disconnectDatabase } from '../src/config/database.js'
import User from '../src/models/User.js'
import { hashPassword, verifyPassword } from '../src/utils/password.js'

process.env.NODE_ENV = 'test'

const ORIGIN = 'http://127.0.0.1:3000'
const PASSWORD = 'MatKhauRatManh!123'
let mongoServer
let sessionStore
let app
let config

async function csrf(agent) {
  const response = await agent.get('/api/auth/csrf').expect(200)
  return response.body.csrfToken
}

async function register(agent, input, expectedStatus = 201) {
  const token = await csrf(agent)
  return agent
    .post('/api/auth/register')
    .set('Origin', ORIGIN)
    .set('x-csrf-token', token)
    .send(input)
    .expect(expectedStatus)
}

async function login(agent, email, password = PASSWORD, expectedStatus = 200) {
  const token = await csrf(agent)
  return agent
    .post('/api/auth/login')
    .set('Origin', ORIGIN)
    .set('x-csrf-token', token)
    .send({ email, password })
    .expect(expectedStatus)
}

before(async () => {
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri('educonect_test')
  config = {
    nodeEnv: 'test',
    production: false,
    port: 3000,
    mongoUri,
    sessionSecret: 'test-secret-that-is-longer-than-thirty-two-characters',
    appOrigin: ORIGIN,
    sessionTtlHours: 8,
    loginRateLimitMax: 2,
    registerRateLimitMax: 20,
    sessionCookieName: 'educonect.sid',
  }
  await connectDatabase(mongoUri)
  await User.syncIndexes()
  sessionStore = MongoStore.create({ mongoUrl: mongoUri, ttl: 8 * 60 * 60 })
  app = createApp({ config, sessionStore, serveClient: false })
})

after(async () => {
  await disconnectDatabase()
  await sessionStore?.close()
  await mongoServer?.stop()
})

test('health, readiness và API 404 có shape an toàn', async () => {
  await request(app).get('/api/health').expect(200, { status: 'ok' })
  await request(app).get('/api/ready').expect(200, { status: 'ready' })
  const missing = await request(app).get('/api/unknown').expect(404)
  assert.equal(missing.body.error.code, 'API_NOT_FOUND')
})

test('đăng ký chỉ nhận parent/tutor, reject field nhạy cảm, hash mật khẩu và email trùng', async () => {
  const agent = request.agent(app)

  const injected = await register(agent, {
    name: 'Phụ huynh Một',
    email: 'parent@example.com',
    password: PASSWORD,
    role: 'parent',
    credits: 999,
    isVerified: true,
  }, 400)
  assert.equal(injected.body.error.code, 'VALIDATION_ERROR')
  assert.equal(await User.countDocuments(), 0)

  const created = await register(agent, {
    name: 'Phụ huynh Một',
    email: 'Parent@Example.com',
    password: PASSWORD,
    role: 'parent',
  })
  assert.equal(created.body.user.role, 'parent')
  assert.equal(created.body.user.email, 'parent@example.com')
  assert.equal('passwordHash' in created.body.user, false)

  const stored = await User.findOne({ emailNormalized: 'parent@example.com' }).select('+passwordHash')
  assert.notEqual(stored.passwordHash, PASSWORD)
  assert.equal(await verifyPassword(stored.passwordHash, PASSWORD), true)

  await register(agent, {
    name: 'Trùng Email',
    email: 'parent@example.com',
    password: PASSWORD,
    role: 'parent',
  }, 409)

  const adminAttempt = await register(agent, {
    name: 'Admin Public',
    email: 'public-admin@example.com',
    password: PASSWORD,
    role: 'admin',
  }, 400)
  assert.equal(adminAttempt.body.error.fields.role.includes('phụ huynh'), true)
})

test('CSRF và Origin bảo vệ request thay đổi', async () => {
  const agent = request.agent(app)
  const token = await csrf(agent)

  await agent
    .post('/api/auth/login')
    .set('Origin', ORIGIN)
    .send({ email: 'parent@example.com', password: PASSWORD })
    .expect(403)

  await agent
    .post('/api/auth/login')
    .set('Origin', 'https://evil.invalid')
    .set('x-csrf-token', token)
    .send({ email: 'parent@example.com', password: PASSWORD })
    .expect(403)
})

test('login rotate session, refresh giữ phiên, profile owner-only, RBAC và logout hủy phiên', async () => {
  const agent = request.agent(app)
  const preAuth = await agent.get('/api/auth/csrf').expect(200)
  const preAuthCookie = preAuth.headers['set-cookie'][0].split(';')[0]

  await agent
    .post('/api/auth/login')
    .set('Origin', ORIGIN)
    .set('x-csrf-token', preAuth.body.csrfToken)
    .send({ email: 'parent@example.com', password: 'SaiMatKhau!123' })
    .expect(401)

  const loggedIn = await agent
    .post('/api/auth/login')
    .set('Origin', ORIGIN)
    .set('x-csrf-token', preAuth.body.csrfToken)
    .send({ email: 'parent@example.com', password: PASSWORD })
    .expect(200)

  const loginCookie = loggedIn.headers['set-cookie'][0].split(';')[0]
  assert.notEqual(loginCookie, preAuthCookie)
  assert.match(loggedIn.headers['set-cookie'][0], /HttpOnly/i)
  assert.match(loggedIn.headers['set-cookie'][0], /SameSite=Lax/i)

  const restartedApp = createApp({ config, sessionStore, serveClient: false })
  const restored = await request(restartedApp)
    .get('/api/auth/me')
    .set('Cookie', loginCookie)
    .expect(200)
  assert.equal(restored.body.user.role, 'parent')

  await agent.get('/api/admin/summary').expect(403)

  const profileCsrf = await csrf(agent)
  const forbiddenPatch = await agent
    .patch('/api/me/profile')
    .set('Origin', ORIGIN)
    .set('x-csrf-token', profileCsrf)
    .send({ role: 'admin', accountStatus: 'active', credits: 2 })
    .expect(400)
  assert.equal(forbiddenPatch.body.error.code, 'VALIDATION_ERROR')

  const updated = await agent
    .patch('/api/me/profile')
    .set('Origin', ORIGIN)
    .set('x-csrf-token', profileCsrf)
    .send({ name: 'Phụ huynh Đã Sửa', location: 'Hà Nội', phone: 'Thông tin riêng tư' })
    .expect(200)
  assert.equal(updated.body.user.name, 'Phụ huynh Đã Sửa')
  assert.equal(updated.body.user.profile.location, 'Hà Nội')
  assert.equal(updated.body.user.role, 'parent')

  const logoutCsrf = await csrf(agent)
  await agent
    .post('/api/auth/logout')
    .set('Origin', ORIGIN)
    .set('x-csrf-token', logoutCsrf)
    .expect(204)
  await agent.get('/api/auth/me').expect(401)
})

test('tutor sai quyền admin; admin CLI-style có quyền summary', async () => {
  const tutorAgent = request.agent(app)
  await register(tutorAgent, {
    name: 'Gia sư Thật',
    email: 'tutor@example.com',
    password: PASSWORD,
    role: 'tutor',
  })
  await login(tutorAgent, 'tutor@example.com')
  await tutorAgent.get('/api/admin/summary').expect(403)

  await User.create({
    name: 'Quản trị Test',
    emailNormalized: 'admin@example.com',
    passwordHash: await hashPassword(PASSWORD),
    role: 'admin',
  })
  const adminAgent = request.agent(app)
  await login(adminAgent, 'admin@example.com')
  const summary = await adminAgent.get('/api/admin/summary').expect(200)
  assert.equal(summary.body.users.parent, 1)
  assert.equal(summary.body.users.tutor, 1)
  assert.equal(summary.body.users.admin, 1)
})

test('giới hạn thử đăng nhập theo IP và email', async () => {
  const agent = request.agent(app)
  const token = await csrf(agent)
  const attempt = () => agent
    .post('/api/auth/login')
    .set('Origin', ORIGIN)
    .set('x-csrf-token', token)
    .send({ email: 'rate-limit@example.com', password: PASSWORD })

  await attempt().expect(401)
  await attempt().expect(401)
  const limited = await attempt().expect(429)
  assert.equal(limited.body.error.code, 'RATE_LIMITED')
})
