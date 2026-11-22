import User from '../models/User.js'
import { connectDatabase, disconnectDatabase } from '../config/database.js'
import { readConfig } from '../config/env.js'
import { hashPassword } from '../utils/password.js'
import { normalizeEmail } from '../utils/validation.js'

const config = readConfig()
const email = normalizeEmail(process.env.ADMIN_EMAIL)
const password = process.env.ADMIN_PASSWORD
const name = process.env.ADMIN_NAME?.trim() || 'Quản trị Educonect+'

if (!email || !email.includes('@')) throw new Error('ADMIN_EMAIL không hợp lệ.')
if (typeof password !== 'string' || password.length < 12 || password.length > 128) {
  throw new Error('ADMIN_PASSWORD phải có từ 12 đến 128 ký tự.')
}

try {
  await connectDatabase(config.mongoUri)
  const existing = await User.findOne({ emailNormalized: email })

  if (existing) {
    if (existing.role !== 'admin') {
      throw new Error('Email đã thuộc một tài khoản không phải admin; không thay đổi dữ liệu.')
    }
    console.log('Admin đã tồn tại; không thay đổi mật khẩu hoặc quyền.')
  } else {
    await User.create({
      name,
      emailNormalized: email,
      passwordHash: await hashPassword(password),
      role: 'admin',
    })
    console.log('Đã tạo admin an toàn từ biến môi trường.')
  }
} finally {
  await disconnectDatabase()
}
