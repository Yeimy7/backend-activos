import { Router } from 'express'
const router = Router()
import * as activoController from '../controllers/activo.controller'
import { authJwt } from '../middlewares'
import { check } from 'express-validator'

router.put('/',
  [
    check('id_activo', 'El id activo es obligatorio').not().isEmpty(),
    check('id_ambiente', 'El id ambiente es obligatorio').not().isEmpty(),
    authJwt.verifyToken,
    authJwt.isSuperAdminOrAdmin
  ], activoController.trasladarActivo)

export default router