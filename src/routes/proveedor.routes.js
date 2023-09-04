import { Router } from 'express'
const router = Router()
import * as proveedorController from '../controllers/proveedor.controller.js'
import * as authJwt from '../middlewares/authJwt.js'
import { check } from 'express-validator'

router.post('/',
  [
    check('razon_social', 'La razón social del proveedor es obligatorio').not().isEmpty(),
    check('encargado', 'El nombre del encargado es obligatorio').not().isEmpty(),
    check('telefono', 'Agrega un numero de telefono válido').isNumeric().optional({ nullable: true }),
    authJwt.verifyToken,
    authJwt.isSuperAdminOrAdmin
  ],
  proveedorController.crearProveedor)

router.get('/', authJwt.verifyToken, proveedorController.obtenerProveedores)
router.get('/:proveedorId', authJwt.verifyToken, proveedorController.obtenerProveedorPorId)
router.put('/:proveedorId', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], proveedorController.actualizarProveedorPorId)
router.put('/down/:proveedorId', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], proveedorController.bajaProveedorPorId)

export default router