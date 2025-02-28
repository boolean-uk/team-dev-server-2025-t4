import { Router } from 'express'
import { createProfile, updateProfile } from '../controllers/profile.js'
import {
  validateAuthentication,
  validatePatchPermissionsForProfiles
} from '../middleware/auth.js'

const router = Router()

router.post('/:id', validateAuthentication, createProfile)
router.patch('/:id', validatePatchPermissionsForProfiles, updateProfile)

export default router
