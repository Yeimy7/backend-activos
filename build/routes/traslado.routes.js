import { Router } from 'express';
const router = Router();
import * as trasladoController from '../controllers/traslado.controller.js'; // import { authJwt } from '../middlewares'

import * as authJwt from '../middlewares/authJwt.js';
import { check } from 'express-validator';
router.post('/', [check('motivo_traslado', 'El motivo de traslado es obligatorio').not().isEmpty(), check('fecha_ocupacion_anterior', 'La fecha de asignacion de ambiente anterior es obligatoria').not().isEmpty(), check('id_activo', 'El activo es obligatorio').not().isEmpty(), check('id_ambiente', 'El ambiente es obligatorio').not().isEmpty(), authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], trasladoController.crearTraslado);
router.post('/pdf', [authJwt.verifyToken], trasladoController.actaTrasladoActivo);
router.get('/', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], trasladoController.obtenerTraslados);
router.get('/:trasladoId', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], trasladoController.obtenerTrasladoPorId);
export default router;