import assert from 'node:assert/strict'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import MongoStore from 'connect-mongo'
import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { connectDatabase, disconnectDatabase } from '../src/config/database.js'

process.env.NODE_ENV = 'test'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const clientDirectory = path.resolve(scriptDirectory, '../../client/dist')
const mongoServer = await MongoMemoryServer.create()
const mongoUri = mongoServer.getUri('educonect_production_smoke')
const config = {
  nodeEnv: 'production',
  production: true,
  port: 3000,
  mongoUri,
  sessionSecret: 'production-smoke-secret-longer-than-thirty-two-characters',
  appOrigin: 'https://educonect.example',
  sessionTtlHours: 8,
  loginRateLimitMax: 10,
  registerRateLimitMax: 5,
  sessionCookieName: 'educonect.sid',
}

let sessionStore

try {
  await connectDatabase(mongoUri)
  sessionStore = MongoStore.create({ mongoUrl: mongoUri, ttl: 8 * 60 * 60 })
  const app = createApp({ config, sessionStore, serveClient: true, clientDirectory })

  const home = await request(app).get('/').set('Accept', 'text/html').expect(200)
  assert.match(home.text, /Educonect\+/)

  const deepLink = await request(app).get('/tutor/dashboard').set('Accept', 'text/html').expect(200)
  assert.match(deepLink.headers['content-type'], /text\/html/)

  await request(app).get('/brand/educonect-logo.png').expect(200).expect('Content-Type', /image\/png/)
  await request(app).get('/api/health').expect(200, { status: 'ok' })
  await request(app).get('/api/ready').expect(200, { status: 'ready' })
  await request(app).get('/api/unknown').expect(404).expect('Content-Type', /application\/json/)
  await request(app).get('/.env').set('Accept', 'text/html').expect(404)
  await request(app).get('/server/src/server.js').set('Accept', 'text/html').expect(404)
  await request(app).get('/reference/legacy-demo').set('Accept', 'text/html').expect(404)

  const csrf = await request(app)
    .get('/api/auth/csrf')
    .set('X-Forwarded-Proto', 'https')
    .expect(200)
  const cookie = csrf.headers['set-cookie'][0]
  assert.match(cookie, /HttpOnly/i)
  assert.match(cookie, /Secure/i)
  assert.match(cookie, /SameSite=Lax/i)

  console.log('Production smoke PASS: same-origin static/API, deep links, protected paths and secure cookie.')
} finally {
  await disconnectDatabase()
  await sessionStore?.close()
  await mongoServer.stop()
}
