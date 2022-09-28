import express from 'express'
import { createAuxiliar, createGrupoContable, createRoles } from './utils/initialSetup'
const app = express()
createRoles()
createGrupoContable()
createAuxiliar()
import cors from 'cors'
import assetsRoutes from './routes/assets.routes'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import proveedorRoutes from './routes/proveedor.routes'
import path from 'path'
import * as middleware from './utils/middleware'
import morgan from 'morgan'

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/assets', assetsRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/proveedores', proveedorRoutes)
// Folder will be used to store public files
app.use('/uploads', express.static(path.resolve('uploads')))
app.use(morgan('dev'))
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app