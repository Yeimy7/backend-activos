import { Router } from 'express'
const router = Router()
import * as userController from '../controllers/user.controller.js'
import { authJwt, veryfySignup } from '../middlewares'
import { check } from 'express-validator'

router.post('/',
  [
    check('nombres', 'El nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'El apellido es obligatorio').not().isEmpty(),
    check('ci', 'El ci es obligatorio').not().isEmpty(),
    check('telefono', 'Agrega un numero de telefono válido').isNumeric().optional({ nullable: true }),
    check('email', 'Agrega un email válido').isEmail(),
    check('password', 'El password debe ser mínimo de 6 caracteres').isLength({ min: 6 }),
    veryfySignup.checkDuplicateUserNameOrEmail,
    authJwt.verifyToken, 
    authJwt.isSuperAdminOrAdmin
  ],
  userController.createUser)
  router.get('/',
  [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin],
   userController.getUsers)
  router.put('/up/:id', [ authJwt.verifyToken, authJwt.isSuperAdmin], userController.ascendUser)
  router.put('/down/:id', [ authJwt.verifyToken, authJwt.isSuperAdmin], userController.descendUser)
  router.delete('/:userId', [authJwt.verifyToken, authJwt.isSuperAdmin], userController.deleteUserById)

export default router