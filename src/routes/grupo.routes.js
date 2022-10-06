import { Router } from 'express'
const router = Router()
import * as grupoController from '../controllers/grupo.controller'
import { authJwt } from '../middlewares'

router.get('/', authJwt.verifyToken, grupoController.obtenerGrupos)
export default router