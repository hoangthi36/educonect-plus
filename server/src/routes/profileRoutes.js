import { Router } from 'express'
import User from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { toSafeUser } from '../utils/safeUser.js'
import { validateProfilePatch } from '../utils/validation.js'

export function createProfileRouter({ mutationProtection }) {
  const router = Router()

  router.use(requireAuth)

  router.get('/', (req, res) => {
    res.json({ user: toSafeUser(req.authUser) })
  })

  router.patch('/', mutationProtection, asyncHandler(async (req, res) => {
    const patch = validateProfilePatch(req.body, req.authUser.role)
    const user = await User.findByIdAndUpdate(
      req.authUser.id,
      { $set: patch },
      { returnDocument: 'after', runValidators: true },
    )
    res.json({ user: toSafeUser(user) })
  }))

  return router
}
