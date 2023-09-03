import { Router } from 'express'
const router = Router()
import * as cargoController from '../controllers/cargo.controller.js'
import { authJwt } from '../middlewares'
import { check } from 'express-validator'

router.post('/',
  [
    check('descripcion_cargo', 'La descripcion del cargo es obligatorio').not().isEmpty(),
    check('nombre_area', 'El nombre del area es obligatorio').not().isEmpty(),
    authJwt.verifyToken,
    authJwt.isSuperAdminOrAdmin
  ],
  cargoController.crearCargo)

router.get('/', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], cargoController.obtenerCargos)
router.get('/:cargoId', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], cargoController.obtenerCargoPorId)
router.put('/:cargoId', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], cargoController.actualizarCargoPorId)
router.put('/down/:cargoId', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], cargoController.bajaCargoPorId)

export default router