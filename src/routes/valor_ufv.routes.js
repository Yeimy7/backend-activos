import { Router } from 'express'
const router = Router()
import * as valorUfvController from '../controllers/valorufv.controller.js'
// import { authJwt } from '../middlewares'
import * as authJwt from '../middlewares/authJwt.js'
import { check } from 'express-validator'


router.post('/',
  [
    check('gestion', 'La gestion es obligatoria').not().isEmpty(),
    check('valor', 'El valor ufv es obligatorio').not().isEmpty(),
    authJwt.verifyToken,
    authJwt.isSuperAdminOrAdmin
  ],
  valorUfvController.crearValorUfv)
  router.get('/', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], valorUfvController.obtenerValoresUfv)
  router.get('/gestion', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], valorUfvController.obtenerValorUfvPorGestion)
  router.get('/gestiones', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], valorUfvController.obtenerGestiones)
  router.get('/max-gestion', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], valorUfvController.obtenerUltimaGestion)
  router.get('/:valorUfvId', [authJwt.verifyToken, authJwt.isSuperAdminOrAdmin], valorUfvController.obtenerValorUfvPorId)


  export default router