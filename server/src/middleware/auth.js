import User from '../models/User.js'
import { HttpError } from '../utils/httpError.js'
import { asyncHandler } from './asyncHandler.js'

export const requireAuth = asyncHandler(async (req, _res, next) => {
  if (!req.session?.userId) {
    throw new HttpError(401, 'AUTH_REQUIRED', 'Bạn cần đăng nhập để tiếp tục.')
  }

  const user = await User.findById(req.session.userId)
  if (!user) {
    throw new HttpError(401, 'SESSION_INVALID', 'Phiên đăng nhập không còn hợp lệ.')
  }
  if (user.accountStatus !== 'active') {
    throw new HttpError(403, 'ACCOUNT_DISABLED', 'Tài khoản đang bị vô hiệu hóa.')
  }

  req.authUser = user
  next()
})

export function requireRole(...roles) {
  return function roleMiddleware(req, _res, next) {
    if (!req.authUser || !roles.includes(req.authUser.role)) {
      return next(new HttpError(403, 'FORBIDDEN', 'Bạn không có quyền thực hiện thao tác này.'))
    }
    return next()
  }
}
