import { Router } from 'express'
import {
  create,
  getById,
  getAll,
  updateById,
  getByName,
  createProfile
} from '../controllers/user.js'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'

const router = Router()

router.post('/', create)
router.get('/', validateAuthentication, getAll)
router.get('/search', validateAuthentication, getByName)
router.get(
  '/teacher/search',
  validateAuthentication,
  validateTeacherRole,
  getByName
)
router.get('/:id', validateAuthentication, getById)
router.patch('/:id', validateAuthentication, validateTeacherRole, updateById)
router.post('/profile/:id', validateAuthentication, createProfile)

export default router
