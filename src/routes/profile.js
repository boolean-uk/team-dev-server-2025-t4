import { Router } from 'express'
import { createProfile } from '../controllers/profile.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.post('/:id', validateAuthentication, createProfile)

export default router
