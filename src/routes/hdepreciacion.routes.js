import { Router } from 'express'
const router = Router()
import * as hdepreciacionController from '../controllers/hdepreciacion.controller.js'
// import { authJwt } from '../middlewares'
import * as authJwt from '../middlewares/authJwt.js'
import { check } from 'express-validator'


router.post('/',
  [
    check('valor_residual', 'El valor_residual es obligatorio').not().isEmpty(),
    check('id_activo', 'El activo es obligatorio').not().isEmpty(),
    authJwt.verifyToken,
    authJwt.isSuperAdminOrAdmin
  ],
  hdepreciacionController.crearHdepreciacion)
router.get('/', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], hdepreciacionController.obtenerHDepreciaciones)
router.get('/por-id-activo', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], hdepreciacionController.obtenerHdepreciacionPorIdActivo)
// router.get('/por-id-gestion', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], hdepreciacionController.obtenerHdepreciacionPorIdActivoGestion)
router.get('/:hdepreciacionId', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], hdepreciacionController.obtenerHdepreciacionPorId)
router.post('/hdepreciaciones',
  [
    check('valor_ufv', 'El valor_ufv es obligatorio').not().isEmpty(),
    check('gestion', 'La gestion es obligatoria').not().isEmpty(),
    authJwt.verifyToken,
    authJwt.isSuperAdminOrAdmin
  ],
  hdepreciacionController.crearHdepreciaciones)
router.post('/cuadro', [authJwt.verifyToken], hdepreciacionController.cuadroDepreciacion)


export default router