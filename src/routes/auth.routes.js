import { Router } from 'express'
const router = Router()
import * as authController from '../controllers/auth.controller'
import { veryfySignup } from '../middlewares'
import { check } from 'express-validator'

router.post('/signin',
  [
    check('email', 'Agrega un email válido').isEmail(),
    check('password', 'El password debe ser mínimo de 6 caracteres').isLength({ min: 6 }),],
  authController.signin)
router.post('/signup',
  [
    check('nombres', 'El nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'El apellido es obligatorio').not().isEmpty(),
    check('ci', 'El ci es obligatorio').not().isEmpty(),
    check('email', 'Agrega un email válido').isEmail(),
    check('password', 'El password debe ser mínimo de 6 caracteres').isLength({ min: 6 }),
    veryfySignup.checkDuplicateUserNameOrEmail],
  authController.signup)

export default router