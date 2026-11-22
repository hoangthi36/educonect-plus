import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import MongoStore from 'connect-mongo'
import express from 'express'
import session from 'express-session'
import helmet from 'helmet'
import { isDatabaseReady } from './config/database.js'
import { errorHandler, notFoundApi } from './middleware/errorHandler.js'
import { createMutationProtection } from './middleware/security.js'
import { createAdminRouter } from './routes/adminRoutes.js'
import { createAuthRouter } from './routes/authRoutes.js'
import { createProfileRouter } from './routes/profileRoutes.js'

const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
const defaultClientDirectory = path.resolve(currentDirectory, '../../client/dist')

export function createApp({ config, sessionStore, serveClient = config.production, clientDirectory = defaultClientDirectory }) {
  const app = express()
  const ttlSeconds = config.sessionTtlHours * 60 * 60
  const store = sessionStore ?? MongoStore.create({
    mongoUrl: config.mongoUri,
    ttl: ttlSeconds,
    autoRemove: 'native',
  })

  app.disable('x-powered-by')
  if (config.production) app.set('trust proxy', 1)

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
      },
    },
  }))
  app.use(express.json({ limit: '16kb' }))

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' })
  })
  app.get('/api/ready', (_req, res) => {
    const ready = isDatabaseReady()
    res.status(ready ? 200 : 503).json({ status: ready ? 'ready' : 'not_ready' })
  })

  app.use(session({
    name: config.sessionCookieName,
    secret: config.sessionSecret,
    store,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: config.production,
      sameSite: 'lax',
      path: '/',
      maxAge: ttlSeconds * 1000,
    },
  }))

  const mutationProtection = createMutationProtection(config.appOrigin)
  app.use('/api/auth', createAuthRouter({ config, mutationProtection }))
  app.use('/api/me/profile', createProfileRouter({ mutationProtection }))
  app.use('/api/admin', createAdminRouter())
  app.use('/api', notFoundApi)

  if (serveClient) {
    const indexPath = path.join(clientDirectory, 'index.html')
    if (!fs.existsSync(indexPath)) {
      throw new Error(`Không tìm thấy React build tại ${indexPath}. Hãy chạy npm run build.`)
    }

    app.use((req, res, next) => {
      const firstSegment = req.path.split('/').filter(Boolean)[0] || ''
      const blocked = firstSegment === 'server'
        || firstSegment === 'reference'
        || firstSegment === 'kem-ban-demo'
        || firstSegment === '.env'
        || firstSegment.startsWith('.env.')
      if (blocked) return res.status(404).send('Not found')
      return next()
    })
    app.use(express.static(clientDirectory, { index: false, fallthrough: true }))
    app.get(/.*/, (req, res, next) => {
      if (!req.accepts('html')) return next()
      return res.sendFile(indexPath)
    })
  }

  app.use((_req, res) => {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Không tìm thấy tài nguyên.' } })
  })
  app.use(errorHandler)

  return app
}
