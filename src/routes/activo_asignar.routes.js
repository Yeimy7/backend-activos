import { Router } from 'express'
const router = Router()
import * as activoController from '../controllers/activo.controller.js'
import * as authJwt from '../middlewares/authJwt.js'
import { check } from 'express-validator'

router.put('/',
  [
    check('id_activo', 'El id activo es obligatorio').not().isEmpty(),
    check('id_persona', 'El id empleado es obligatorio').not().isEmpty(),
    authJwt.verifyToken,
    authJwt.isSuperAdminOrAdmin
  ], activoController.asignarActivo)
router.get('/', [authJwt.verifyToken], activoController.activosAsignados)
router.get('/no', [authJwt.verifyToken], activoController.activosNoAsignados)
router.get('/total', [authJwt.verifyToken], activoController.totalAsignados)
router.put('/desvincular', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], activoController.desvincularActivo)
router.post('/pdf', [authJwt.verifyToken], activoController.actaAsignacionActivo)
export default router