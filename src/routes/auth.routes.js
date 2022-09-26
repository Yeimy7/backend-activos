import { Router } from 'express'
const router = Router()
import * as authController from '../controllers/auth.controller'
import { authJwt } from '../middlewares'
import { check } from 'express-validator'
import multer from '../utils/multer'

router.post('/signin', authController.signin)
router.get('/profile', [authJwt.verifyToken], authController.profile)
router.put('/profile', [authJwt.verifyToken], authController.updateData)
router.put('/profile/pwd', [authJwt.verifyToken], authController.updatePassword)
router.put('/profile/img', [authJwt.verifyToken, multer.single('image')], authController.updateImageProfile)

export default router