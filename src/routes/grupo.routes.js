import { Router } from 'express'
const router = Router()
import * as grupoController from '../controllers/grupo.controller.js'
import { authJwt } from '../middlewares'

router.get('/', authJwt.verifyToken, grupoController.obtenerGrupos)
router.get('/total', authJwt.verifyToken, grupoController.obtenerTotalPorGrupos)
export default router