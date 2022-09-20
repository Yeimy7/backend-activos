import { Router } from 'express'
const router = Router()
import * as assetsController from '../controllers/assets.controller'
import { authJwt } from '../middlewares'

router.get('/', assetsController.getAssets)
router.get('/:assetId', assetsController.getAssetById)
router.post('/', [authJwt.verifyToken, authJwt.isAdmin], assetsController.createAsset)
router.put('/:assetId', [authJwt.verifyToken, authJwt.isAdmin], assetsController.updateAssetById)
router.delete('/:assetId', [authJwt.verifyToken, authJwt.isSuperAdmin], assetsController.deleteAssetById)

export default router