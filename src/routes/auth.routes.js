import { Router } from 'express'
const router = Router()
import * as authController from '../controllers/auth.controller'
import { authJwt } from '../middlewares'
import { check } from 'express-validator'

router.post('/signin', authController.signin)

router.get('/profile', [authJwt.verifyToken], authController.profile)

export default router