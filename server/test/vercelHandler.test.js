import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import express from 'express'
import request from 'supertest'
import { createVercelHandler, normalizeVercelApiRequest } from '../src/vercelHandler.js'

const testDirectory = path.dirname(fileURLToPath(import.meta.url))
const repositoryRoot = path.resolve(testDirectory, '../..')

test('rewrite Vercel khôi phục API path và giữ query string', () => {
  const req = { url: '/api/index?__path=auth/csrf&next=dashboard' }
  normalizeVercelApiRequest(req)
  assert.equal(req.url, '/api/auth/csrf?next=dashboard')
})

test('rewrite Vercel không cho path nội bộ bất hợp lệ', () => {
  const req = { url: '/api/index?__path=../.env' }
  normalizeVercelApiRequest(req)
  assert.equal(req.url, '/api/__invalid__')
})

test('Vercel handler khởi tạo app một lần và không phục vụ static qua Express', async () => {
  let initializationCount = 0
  const apiApp = express()
  apiApp.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
  const handler = createVercelHandler({
    configReader: () => ({ mongoUri: 'mongodb://fixture.invalid/test' }),
    databaseConnector: async () => { initializationCount += 1 },
    appFactory: ({ serveClient }) => {
      assert.equal(serveClient, false)
      return apiApp
    },
    logger: { error() {} },
  })
  const wrapper = express()
  wrapper.use(handler)

  await request(wrapper).get('/api/index?__path=health').expect(200, { status: 'ok' })
  await request(wrapper).get('/api/index?__path=health').expect(200, { status: 'ok' })
  assert.equal(initializationCount, 1)
})

test('lỗi khởi tạo Vercel trả 503 mà không lộ chuỗi kết nối', async () => {
  const handler = createVercelHandler({
    configReader: () => ({ mongoUri: 'mongodb://fixture.invalid/test' }),
    databaseConnector: async () => { throw new Error('mongodb://user:secret@host/test') },
    logger: { error() {} },
  })
  const wrapper = express()
  wrapper.use(handler)

  const response = await request(wrapper).get('/api/index?__path=auth/me').expect(503)
  assert.equal(response.body.error.code, 'SERVICE_UNAVAILABLE')
  assert.equal(JSON.stringify(response.body).includes('secret'), false)
})

test('vercel.json giữ API rewrite trước SPA fallback và đúng output', async () => {
  const config = JSON.parse(await fs.readFile(path.join(repositoryRoot, 'vercel.json'), 'utf8'))
  assert.equal(config.buildCommand, 'npm run build')
  assert.equal(config.outputDirectory, 'client/dist')
  assert.equal(config.rewrites[0].source, '/api/:path*')
  assert.equal(config.rewrites[1].destination, '/index.html')
})
