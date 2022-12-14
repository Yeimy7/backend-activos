import { Router } from 'express'
const router = Router()
import * as activoController from '../controllers/activo.controller'
import { authJwt, veryfyAssetCode } from '../middlewares'
import { check } from 'express-validator'
import multer from '../utils/multer'


router.post('/',
  [
    check('codigo_activo', 'El código de activo es obligatorio').not().isEmpty(),
    check('fecha_ingreso', 'La fecha de ingreso del activo es obligatoria').not().isEmpty(),
    check('descripcion_activo', 'La descripción del activo es obligatoria').not().isEmpty(),
    check('costo', 'El costo del activo es obligatorio').not().isEmpty().isFloat(),
    check('codigo_ambiente', 'El código del ambiente es obligatorio').not().isEmpty(),
    check('descripcion_aux', 'El tipo de auxiliar es obligatorio').not().isEmpty(),
    check('descripcion_g', 'El grupo contable es obligatorio').not().isEmpty(),
    check('razon_social', 'La razon social del proveedor es obligatorio').not().isEmpty(),
    veryfyAssetCode.checkDuplicateAssetCode,
    authJwt.verifyToken,
    authJwt.isSuperAdminOrAdmin
  ],
  activoController.crearActivo)
router.post('/pdf', [authJwt.verifyToken], activoController.actaActivos)
router.post('/depreciacion/pdf', [authJwt.verifyToken], activoController.actaDepreciacionActivos)
router.get('/', [authJwt.verifyToken], activoController.obtenerActivos)
router.get('/:activoId', [authJwt.verifyToken], activoController.obtenerActivoPorId)
router.put('/:activoId', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin, veryfyAssetCode.checkDuplicateAssetCode], activoController.actualizarActivoPorId)
router.put('/img/:activoId', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin, multer.single('img_activo')], activoController.actualizarImagenActivoPorId)
router.put('/down/:activoId', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], activoController.bajaActivoPorId)

export default router