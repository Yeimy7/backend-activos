import { Router } from 'express'
const router = Router()
import * as pisoController from '../controllers/piso.controller'
import { authJwt } from '../middlewares'
import { check } from 'express-validator'

router.post('/',
  [
    check('codigo_piso', 'El código del piso es obligatorio').not().isEmpty(),
    check('id_edificio', 'El id del edificio es obligatorio').not().isEmpty(),
    authJwt.verifyToken,
    authJwt.isSuperAdminOrAdmin
  ],
  pisoController.crearPiso)

router.get('/', authJwt.verifyToken, pisoController.obtenerPisos)
router.get('/por_edificio/:edificioId', authJwt.verifyToken, pisoController.obtenerPisosPorEdificio)
router.get('/:pisoId', authJwt.verifyToken, pisoController.obtenerPisoPorId)
router.put('/:pisoId', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], pisoController.actualizarPisoPorId)
router.put('/baja/:pisoId', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], pisoController.bajaPisoPorId)

export default router