import express from 'express';
import { createGrupoContable, createRoles } from './utils/initialSetup.js';
const app = express(); // createRoles()
// createGrupoContable()
// createAuxiliar()

import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import proveedorRoutes from './routes/proveedor.routes.js';
import areaRoutes from './routes/area.routes.js';
import cargoRoutes from './routes/cargo.routes.js';
import empleadoRoutes from './routes/empleado.routes.js';
import activoRoutes from './routes/activo.routes.js';
import asignarRoutes from './routes/activo_asignar.routes.js';
import auxiliarRoutes from './routes/auxiliar.routes.js';
import grupoRoutes from './routes/grupo.routes.js';
import ambienteRoutes from './routes/ambiente.routes.js';
import devolucionRoutes from './routes/devolucion.routes.js';
import bajaRoutes from './routes/baja.routes.js';
import trasladoRoutes from './routes/traslado.routes.js';
import trasladarRoutes from './routes/activo_traslado.routes.js';
import hdepreciacionRoutes from './routes/hdepreciacion.routes.js';
import valorUfvRoutes from './routes/valor_ufv.routes.js';
import pisoRoutes from './routes/piso.routes.js';
import edificioRoutes from './routes/edificio.routes.js';
import path from 'path';
import * as middleware from './utils/middleware.js';
import morgan from 'morgan';
app.use(cors());
app.use(express.static('build'));
app.use(express.static('public'));
app.use(express.json());
app.use(middleware.requestLogger);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/areas', areaRoutes);
app.use('/api/cargos', cargoRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/activos', activoRoutes);
app.use('/api/asignados', asignarRoutes);
app.use('/api/auxiliares', auxiliarRoutes);
app.use('/api/grupos', grupoRoutes);
app.use('/api/ambientes', ambienteRoutes);
app.use('/api/pisos', pisoRoutes);
app.use('/api/edificios', edificioRoutes);
app.use('/api/devoluciones', devolucionRoutes);
app.use('/api/bajas', bajaRoutes);
app.use('/api/traslados', trasladoRoutes);
app.use('/api/trasladar', trasladarRoutes);
app.use('/api/hdepreciacion', hdepreciacionRoutes);
app.use('/api/valor', valorUfvRoutes); // Folder will be used to store public files

app.use('/uploads', express.static(path.resolve('uploads')));
app.use(morgan('dev'));
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);
export default app;