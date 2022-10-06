import { Router } from 'express'
const router = Router()
import * as ambienteController from '../controllers/ambiente.controller'
import { authJwt } from '../middlewares'

router.get('/', authJwt.verifyToken, ambienteController.obtenerAmbientes)
export default router