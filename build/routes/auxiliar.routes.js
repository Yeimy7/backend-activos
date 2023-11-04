import { Router } from 'express';
const router = Router();
import * as auxiliarController from '../controllers/auxiliar.controller.js'; // import { authJwt } from '../middlewares'

import * as authJwt from '../middlewares/authJwt.js';
router.get('/', authJwt.verifyToken, auxiliarController.obtenerAuxiliares);
export default router;