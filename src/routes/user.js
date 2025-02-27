import { Router } from 'express'
import {
  create,
  getById,
  getAll,
  updateById,
  getStudentsByName
} from '../controllers/user.js'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'

const router = Router()

router.post('/', create)
router.get('/', validateAuthentication, getAll)
router.get('/:id', validateAuthentication, getById)
router.get('/students/:name', validateAuthentication, getStudentsByName)
router.patch('/:id', validateAuthentication, validateTeacherRole, updateById)

export default router
