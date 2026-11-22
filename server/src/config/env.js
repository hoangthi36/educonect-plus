import 'dotenv/config'

function required(env, key) {
  const value = env[key]?.trim()
  if (!value) throw new Error(`Thiếu biến môi trường bắt buộc: ${key}`)
  return value
}

function positiveInteger(value, fallback, { min = 1, max = Number.MAX_SAFE_INTEGER } = {}) {
  if (value === undefined || value === '') return fallback
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    throw new Error(`Giá trị cấu hình số không hợp lệ: ${value}`)
  }
  return parsed
}

export function readConfig(env = process.env) {
  const nodeEnv = env.NODE_ENV?.trim() || 'development'
  const production = nodeEnv === 'production'
  const mongoUri = required(env, 'MONGODB_URI')
  const sessionSecret = required(env, 'SESSION_SECRET')
  const appOriginValue = required(env, 'APP_ORIGIN')

  if (sessionSecret.length < 32) {
    throw new Error('SESSION_SECRET phải có ít nhất 32 ký tự.')
  }

  let appOrigin
  try {
    const parsed = new URL(appOriginValue)
    appOrigin = parsed.origin
    if (appOriginValue.replace(/\/$/, '') !== appOrigin) {
      throw new Error('APP_ORIGIN chỉ được chứa origin, không chứa path.')
    }
    if (production && parsed.protocol !== 'https:') {
      throw new Error('APP_ORIGIN production phải dùng HTTPS.')
    }
  } catch (error) {
    if (error.message.includes('APP_ORIGIN')) throw error
    throw new Error('APP_ORIGIN không phải URL hợp lệ.')
  }

  const sessionTtlHours = positiveInteger(env.SESSION_TTL_HOURS, 8, { min: 1, max: 168 })

  return {
    nodeEnv,
    production,
    port: positiveInteger(env.PORT, 3000, { min: 1, max: 65535 }),
    mongoUri,
    sessionSecret,
    appOrigin,
    sessionTtlHours,
    loginRateLimitMax: positiveInteger(env.LOGIN_RATE_LIMIT_MAX, 10, { min: 1, max: 1000 }),
    registerRateLimitMax: positiveInteger(env.REGISTER_RATE_LIMIT_MAX, 5, { min: 1, max: 1000 }),
    sessionCookieName: 'educonect.sid',
  }
}
