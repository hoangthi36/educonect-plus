import { Router } from 'express'
import User from '../models/User.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export function createAdminRouter() {
  const router = Router()

  router.use(requireAuth, requireRole('admin'))

  router.get('/summary', asyncHandler(async (_req, res) => {
    const counts = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ])
    const byRole = Object.fromEntries(counts.map((item) => [item._id, item.count]))
    res.json({
      users: {
        total: counts.reduce((total, item) => total + item.count, 0),
        parent: byRole.parent ?? 0,
        tutor: byRole.tutor ?? 0,
        admin: byRole.admin ?? 0,
      },
    })
  }))

  return router
}
