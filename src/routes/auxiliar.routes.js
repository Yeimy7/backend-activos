import { Router } from 'express'
const router = Router()
import * as auxiliarController from '../controllers/auxiliar.controller'
import { authJwt } from '../middlewares'

router.get('/', authJwt.verifyToken, auxiliarController.obtenerAuxiliares)
export default router