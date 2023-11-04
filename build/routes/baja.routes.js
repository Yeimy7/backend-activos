import { Router } from 'express';
const router = Router();
import * as bajaController from '../controllers/baja.controller.js'; // import { authJwt } from '../middlewares'

import * as authJwt from '../middlewares/authJwt.js';
import { check } from 'express-validator';
router.post('/', [check('motivo_baja', 'El motivo de devolucion es obligatorio').not().isEmpty(), check('id_activo', 'El activo es obligatorio').not().isEmpty(), authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], bajaController.crearBaja);
router.post('/pdf', [authJwt.verifyToken], bajaController.actaBajaActivo);
router.get('/', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], bajaController.obtenerBajas);
router.get('/total', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], bajaController.totalBajas);
router.get('/:bajaId', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], bajaController.obtenerBajaPorId);
export default router;