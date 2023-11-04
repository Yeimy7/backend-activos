import { Router } from 'express';
const router = Router();
import * as devolucionController from '../controllers/devolucion.controller.js'; // import { authJwt } from '../middlewares

import * as authJwt from '../middlewares/authJwt.js';
import { check } from 'express-validator';
router.post('/', [check('motivo_devolucion', 'El motivo de devolucion es obligatorio').not().isEmpty(), check('fecha_asignacion', 'La fecha de asignacion del activo es obligatoria').not().isEmpty(), check('id_activo', 'El activo es obligatorio').not().isEmpty(), check('id_persona', 'El empleado es obligatorio').not().isEmpty(), authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], devolucionController.crearDevolucion);
router.post('/pdf', [authJwt.verifyToken], devolucionController.actaDevolucionActivo);
router.get('/', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], devolucionController.obtenerDevoluciones);
router.get('/:devolucionId', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], devolucionController.obtenerDevolucionPorId);
export default router;