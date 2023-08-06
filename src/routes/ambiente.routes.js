import { Router } from 'express'
const router = Router()
import * as ambienteController from '../controllers/ambiente.controller'
import { authJwt } from '../middlewares'
import { check } from 'express-validator'

router.post('/',
  [
    check('codigo_ambiente', 'El código del ambiente es obligatorio').not().isEmpty(),
    check('tipo_ambiente', 'El tipo de ambiente es obligatorio').not().isEmpty(),
    check('id_piso', 'El id del piso es obligatorio').not().isEmpty(),
    authJwt.verifyToken,
    authJwt.isSuperAdminOrAdmin
  ],
  ambienteController.crearAmbiente)

router.get('/', authJwt.verifyToken, ambienteController.obtenerAmbientes)
router.get('/por_piso/:pisoId', authJwt.verifyToken, ambienteController.obtenerAmbientesPorPiso)
router.get('/:ambienteId', authJwt.verifyToken, ambienteController.obtenerAmbientePorId)
router.put('/:ambienteId', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], ambienteController.actualizarAmbientePorId)
router.put('/baja/:ambienteId', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], ambienteController.bajaAmbientePorId)

export default router