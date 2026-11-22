import { validationError } from './httpError.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ROLES = new Set(['parent', 'tutor'])

export function normalizeEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : ''
}

function rejectUnknownKeys(body, allowedKeys) {
  const unknown = Object.keys(body ?? {}).filter((key) => !allowedKeys.includes(key))
  if (unknown.length) {
    throw validationError(
      Object.fromEntries(unknown.map((key) => [key, 'Trường này không được phép.'])),
      'Yêu cầu chứa trường không được phép.',
    )
  }
}

function validateName(value, fields) {
  if (typeof value !== 'string' || value.trim().length < 2 || value.trim().length > 80) {
    fields.name = 'Họ tên phải có từ 2 đến 80 ký tự.'
    return ''
  }
  return value.trim().replace(/\s+/g, ' ')
}

function validateEmail(value, fields) {
  const email = normalizeEmail(value)
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    fields.email = 'Email không hợp lệ.'
  }
  return email
}

function validatePassword(value, fields) {
  if (typeof value !== 'string' || value.length < 12 || value.length > 128) {
    fields.password = 'Mật khẩu phải có từ 12 đến 128 ký tự.'
    return ''
  }
  return value
}

export function validateRegistration(body) {
  rejectUnknownKeys(body, ['name', 'email', 'password', 'role'])
  const fields = {}
  const name = validateName(body?.name, fields)
  const email = validateEmail(body?.email, fields)
  const password = validatePassword(body?.password, fields)
  const role = typeof body?.role === 'string' ? body.role : ''
  if (!ROLES.has(role)) fields.role = 'Chỉ được đăng ký vai trò phụ huynh hoặc gia sư.'
  if (Object.keys(fields).length) throw validationError(fields)
  return { name, email, password, role }
}

export function validateLogin(body) {
  rejectUnknownKeys(body, ['email', 'password'])
  const fields = {}
  const email = validateEmail(body?.email, fields)
  const password = typeof body?.password === 'string' ? body.password : ''
  if (!password || password.length > 128) fields.password = 'Mật khẩu không hợp lệ.'
  if (Object.keys(fields).length) throw validationError(fields)
  return { email, password }
}

export function validateProfilePatch(body, role) {
  const allowed = ['name', 'phone', 'location', 'headline']
  if (role === 'tutor') allowed.push('subjects')
  rejectUnknownKeys(body, allowed)
  const fields = {}
  const patch = {}

  if ('name' in body) patch.name = validateName(body.name, fields)

  for (const key of ['phone', 'location', 'headline']) {
    if (!(key in body)) continue
    if (typeof body[key] !== 'string') {
      fields[key] = 'Giá trị phải là chuỗi.'
      continue
    }
    const value = body[key].trim()
    const maxLength = key === 'headline' ? 160 : 100
    if (value.length > maxLength) fields[key] = `Tối đa ${maxLength} ký tự.`
    else patch[`profile.${key}`] = value
  }

  if ('subjects' in body) {
    if (!Array.isArray(body.subjects) || body.subjects.length > 10) {
      fields.subjects = 'Danh sách môn học tối đa 10 mục.'
    } else {
      const subjects = body.subjects.map((item) => (typeof item === 'string' ? item.trim() : ''))
      if (subjects.some((item) => !item || item.length > 50)) {
        fields.subjects = 'Mỗi môn học phải có từ 1 đến 50 ký tự.'
      } else {
        patch['profile.subjects'] = [...new Set(subjects)]
      }
    }
  }

  if (!Object.keys(body ?? {}).length) fields.form = 'Cần ít nhất một trường để cập nhật.'
  if (Object.keys(fields).length) throw validationError(fields)
  return patch
}
