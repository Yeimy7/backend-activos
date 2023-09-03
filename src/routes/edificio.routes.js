import { Router } from 'express'
const router = Router()
import * as edificioController from '../controllers/edificio.controller.js'
import { authJwt } from '../middlewares'
import { check } from 'express-validator'

router.post('/',
  [
    check('nombre_edificio', 'El nombre del edificio es obligatorio').not().isEmpty(),
    authJwt.verifyToken,
    authJwt.isSuperAdminOrAdmin
  ],
  edificioController.crearEdificio)

router.get('/', authJwt.verifyToken, edificioController.obtenerEdificios)
router.get('/:edificioId', authJwt.verifyToken, edificioController.obtenerEdificioPorId)
router.put('/:edificioId', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], edificioController.actualizarEdificioPorId)
router.put('/baja/:edificioId', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], edificioController.bajaEdificioPorId)

export default router