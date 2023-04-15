import { Router } from 'express'
const router = Router()
import * as empleadoController from '../controllers/empleado.controller'
import { authJwt } from '../middlewares'
import { check } from 'express-validator'

router.post('/',
  [
    check('nombres', 'El nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'El apellido es obligatorio').not().isEmpty(),
    check('ci', 'El ci es obligatorio').not().isEmpty(),
    check('descripcion_cargo', 'El cargo es obligatorio').not().isEmpty(),
    authJwt.verifyToken,
    authJwt.isSuperAdminOrAdmin
  ],
  empleadoController.crearEmpleado)

router.get('/', authJwt.verifyToken, empleadoController.obtenerEmpleados)
router.get('/total', authJwt.verifyToken, empleadoController.totalEmpleados)
router.get('/:empleadoId', authJwt.verifyToken, empleadoController.obtenerEmpleadoPorId)
router.put('/:empleadoId', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], empleadoController.actualizarEmpleadoPorId)
router.put('/down/:empleadoId', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], empleadoController.bajaEmpleadoPorId)

export default router