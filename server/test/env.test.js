import assert from 'node:assert/strict'
import path from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { loadRootEnv, projectRootEnvPath } from '../src/config/env.js'

const testDirectory = path.dirname(fileURLToPath(import.meta.url))
const repositoryRoot = path.resolve(testDirectory, '../..')

test('đường dẫn .env luôn trỏ tới project root, không phụ thuộc cwd', () => {
  assert.equal(projectRootEnvPath, path.join(repositoryRoot, '.env'))
})

test('biến môi trường nền tảng được ưu tiên hơn file env', () => {
  const platformValue = 'platform-secret-kept-without-printing'
  const targetEnv = { SESSION_SECRET: platformValue }

  loadRootEnv({
    env: targetEnv,
    envPath: path.join(repositoryRoot, '.env.example'),
  })

  assert.equal(targetEnv.SESSION_SECRET, platformValue)
  assert.equal(targetEnv.NODE_ENV, 'development')
  assert.equal(targetEnv.MONGODB_URI, 'mongodb://127.0.0.1:27017/educonect_dev')
})
