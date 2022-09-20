import { Router } from 'express'
const router = Router()
import * as userController from '../controllers/user.controller'
import { authJwt } from '../middlewares'

router.post('/', [authJwt.verifyToken, authJwt.isAdmin], userController.createUser)
// router.post('/signup', authController.signup)

export default router