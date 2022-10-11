import express from 'express'
import { createAmbiente, createAuxiliar, createEdificio, createGrupoContable, createPiso, createRoles } from './utils/initialSetup'
const app = express()
createRoles()
createGrupoContable()
createAuxiliar()
createEdificio()
createPiso()
createAmbiente()
import cors from 'cors'
import assetsRoutes from './routes/assets.routes'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import proveedorRoutes from './routes/proveedor.routes'
import areaRoutes from './routes/area.routes'
import cargoRoutes from './routes/cargo.routes'
import empleadoRoutes from './routes/empleado.routes'
import activoRoutes from './routes/activo.routes'
import asignarRoutes from './routes/activo_asignar.routes'
import auxiliarRoutes from './routes/auxiliar.routes'
import grupoRoutes from './routes/grupo.routes'
import ambienteRoutes from './routes/ambiente.routes'
import devolucionRoutes from './routes/devolucion.routes'
import bajaRoutes from './routes/baja.routes'
import trasladoRoutes from './routes/traslado.routes'
import trasladarRoutes from './routes/activo_traslado.routes'
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
app.use('/api/areas', areaRoutes)
app.use('/api/cargos', cargoRoutes)
app.use('/api/empleados', empleadoRoutes)
app.use('/api/activos', activoRoutes)
app.use('/api/asignados', asignarRoutes)
app.use('/api/auxiliares', auxiliarRoutes)
app.use('/api/grupos', grupoRoutes)
app.use('/api/ambientes', ambienteRoutes)
app.use('/api/devoluciones', devolucionRoutes)
app.use('/api/bajas', bajaRoutes)
app.use('/api/traslados', trasladoRoutes)
app.use('/api/trasladar', trasladarRoutes)
// Folder will be used to store public files
app.use('/uploads', express.static(path.resolve('uploads')))
app.use(morgan('dev'))
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app