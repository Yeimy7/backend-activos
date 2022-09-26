import { Router } from 'express'
const router = Router()
import * as authController from '../controllers/auth.controller'
import { authJwt } from '../middlewares'
import { check } from 'express-validator'

router.post('/signin', authController.signin)
router.get('/profile', [authJwt.verifyToken], authController.profile)
router.put('/profile', [authJwt.verifyToken], authController.updateData)
router.put('/profile/pwd', [authJwt.verifyToken], authController.updatePassword)

export default router