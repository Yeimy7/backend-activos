import { Router } from 'express'
const router = Router()
import * as areaController from '../controllers/area.controller.js'
import * as authJwt from '../middlewares/authJwt.js'
import { check } from 'express-validator'

router.post('/',
  [
    check('nombre_area', 'El nombre de área es obligatorio').not().isEmpty(),
    check('codigo_area', 'El código de área es obligatorio').not().isEmpty(),
    authJwt.verifyToken,
    authJwt.isSuperAdminOrAdmin
  ],
  areaController.crearArea)

router.get('/', authJwt.verifyToken, areaController.obtenerAreas)
router.get('/:areaId', authJwt.verifyToken, areaController.obtenerAreaPorId)
router.put('/:areaId', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], areaController.actualizarAreaPorId)
router.put('/down/:areaId', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], areaController.bajaAreaPorId)

export default router