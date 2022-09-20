import { Router } from 'express'
const router = Router()
import * as userController from '../controllers/user.controller'
import { authJwt, veryfySignup } from '../middlewares'
import { check } from 'express-validator'

router.post('/',
  [
    check('nombres', 'El nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'El apellido es obligatorio').not().isEmpty(),
    check('ci', 'El ci es obligatorio').not().isEmpty(),
    check('email', 'Agrega un email válido').isEmail(),
    check('password', 'El password debe ser mínimo de 6 caracteres').isLength({ min: 6 }),
    veryfySignup.checkDuplicateUserNameOrEmail,
    authJwt.verifyToken, 
    authJwt.isSuperAdmin
  ],
  userController.createUser)

export default router