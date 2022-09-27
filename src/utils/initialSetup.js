import * as logger from '../utils/logger'
import { QueryTypes } from 'sequelize'
import conectarDB from '../config/db'
import Role from '../models/Role'
import GrupoContable from '../models/GrupoContable'

export const createRoles = async () => {
  await Role.estimated
  try {
    const [count] = await conectarDB.query(`SELECT count(*) FROM information_schema.TABLES WHERE (TABLE_SCHEMA = 'activos') AND (TABLE_NAME = 'rol')`, { type: QueryTypes.SELECT });
    if (Object.values(count)[0] > 0) return

    await Promise.all([
      new Role({ nombre_rol: 'Administrador' }).save(),
      new Role({ nombre_rol: 'Super-admin' }).save(),
      new Role({ nombre_rol: 'Usuario' }).save()
    ])
    console.log('Tabla Rol creada')
  } catch (error) {
    logger.error(error)
  }
}

export const createGrupoContable = async () => {
  await GrupoContable.estimated
  try {
    const [count] = await conectarDB.query(`SELECT count(*) FROM information_schema.TABLES WHERE (TABLE_SCHEMA = 'activos') AND (TABLE_NAME = 'grupo_contable')`, { type: QueryTypes.SELECT });
    if (Object.values(count)[0] > 0) return

    await Promise.all([
      new GrupoContable({ descripcion: 'Muebles y enseres de oficina', vida_util: 10, coeficiente: 10 }).save(),
      new GrupoContable({ descripcion: 'Maquinaria en general', vida_util: 8, coeficiente: 12.5 }).save(),
      new GrupoContable({ descripcion: 'Equipos e instalaciones', vida_util: 8, coeficiente: 12.5 }).save(),
      new GrupoContable({ descripcion: 'Vehículos automotores', vida_util: 5, coeficiente: 20 }).save(),
      new GrupoContable({ descripcion: 'Maquinaria para la construcción', vida_util: 5, coeficiente: 20 }).save(),
      new GrupoContable({ descripcion: 'Maquinaria agrícola', vida_util: 4, coeficiente: 25 }).save(),
      new GrupoContable({ descripcion: 'Herramientas en general', vida_util: 4, coeficiente: 25 }).save(),
      new GrupoContable({ descripcion: 'Equipos de computación', vida_util: 4, coeficiente: 25 }).save(),
      new GrupoContable({ descripcion: 'Alambrados, tranqueras y vallas', vida_util: 10, coeficiente: 10 }).save(),
      new GrupoContable({ descripcion: 'Viviendas para el personal', vida_util: 20, coeficiente: 5 }).save(),
      new GrupoContable({ descripcion: 'Muebles y enseres en las viviendas para el personal', vida_util: 10, coeficiente: 10 }).save(),
      new GrupoContable({ descripcion: 'Tinglados y cobertizos de madera', vida_util: 5, coeficiente: 20 }).save(),
      new GrupoContable({ descripcion: 'Tinglados y cobertizos de metal', vida_util: 10, coeficiente: 10 }).save(),
    ])
    console.log('Tabla grupo_contable creada')
  } catch (error) {
    logger.error('------>',error)
  }
}