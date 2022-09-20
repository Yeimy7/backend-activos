import { Router } from 'express'
const router = Router()
import * as authController from '../controllers/auth.controller'
import { authJwt } from '../middlewares'
import { check } from 'express-validator'

router.post('/signin',
  [
    check('email', 'Agrega un email válido').isEmail(),
    check('password', 'El password debe ser mínimo de 6 caracteres').isLength({ min: 6 }),],
  authController.signin
)

router.get('/profile', [authJwt.verifyToken], authController.profile)

export default router