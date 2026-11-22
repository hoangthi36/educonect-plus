import { createApp } from './app.js'
import { connectDatabase } from './config/database.js'
import { readConfig } from './config/env.js'

const INTERNAL_PATH_PARAM = '__path'
const SAFE_API_PATH = /^[A-Za-z0-9/_-]*$/

export function normalizeVercelApiRequest(req) {
  const parsed = new URL(req.url, 'http://vercel.internal')
  const capturedPath = parsed.searchParams.get(INTERNAL_PATH_PARAM)
  if (capturedPath === null) return

  parsed.searchParams.delete(INTERNAL_PATH_PARAM)
  const safePath = SAFE_API_PATH.test(capturedPath) && !capturedPath.split('/').includes('..')
    ? capturedPath.replace(/^\/+|\/+$/g, '')
    : '__invalid__'
  const query = parsed.searchParams.toString()
  req.url = `/api/${safePath}${query ? `?${query}` : ''}`
}

export function createVercelHandler({
  configReader = readConfig,
  databaseConnector = connectDatabase,
  appFactory = createApp,
  logger = console,
} = {}) {
  let appPromise

  const initialize = async () => {
    const config = configReader()
    await databaseConnector(config.mongoUri)
    return appFactory({ config, serveClient: false })
  }

  return async function vercelHandler(req, res) {
    normalizeVercelApiRequest(req)

    try {
      appPromise ??= initialize().catch((error) => {
        appPromise = null
        throw error
      })
      const app = await appPromise
      return app(req, res)
    } catch {
      logger.error('Vercel API initialization failed.')
      if (res.headersSent) return res.end()
      res.statusCode = 503
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      return res.end(JSON.stringify({
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Dịch vụ tạm thời không khả dụng.',
        },
      }))
    }
  }
}
