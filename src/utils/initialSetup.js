import * as logger from '../utils/logger'
import { QueryTypes } from 'sequelize'
import conectarDB from '../config/db'
import Role from '../models/Role'
import GrupoContable from '../models/GrupoContable'
import Auxiliar from '../models/Auxiliar'
import Area from '../models/Area'

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
    logger.error('------>', error)
  }
}

export const createAuxiliar = async () => {
  await Auxiliar.estimated
  try {
    const [count] = await conectarDB.query(`SELECT count(*) FROM information_schema.TABLES WHERE (TABLE_SCHEMA = 'activos') AND (TABLE_NAME = 'auxiliar')`, { type: QueryTypes.SELECT });
    if (Object.values(count)[0] > 0) return

    await Promise.all([
      //Equipo de oficina y muebles
      new Auxiliar({ descripcion: 'alacena' }).save(),
      new Auxiliar({ descripcion: 'archivador' }).save(),
      new Auxiliar({ descripcion: 'armario' }).save(),
      new Auxiliar({ descripcion: 'banco' }).save(),
      new Auxiliar({ descripcion: 'batidora' }).save(),
      new Auxiliar({ descripcion: 'caja fuerte' }).save(),
      new Auxiliar({ descripcion: 'caja registradora' }).save(),
      new Auxiliar({ descripcion: 'carro móvil' }).save(),
      new Auxiliar({ descripcion: 'casillero' }).save(),
      new Auxiliar({ descripcion: 'catre' }).save(),
      new Auxiliar({ descripcion: 'colgador' }).save(),
      new Auxiliar({ descripcion: 'cómoda' }).save(),
      new Auxiliar({ descripcion: 'credensa' }).save(),
      new Auxiliar({ descripcion: 'cuna' }).save(),
      new Auxiliar({ descripcion: 'dispensador de agua' }).save(),
      new Auxiliar({ descripcion: 'diván' }).save(),
      new Auxiliar({ descripcion: 'duplicador digital' }).save(),
      new Auxiliar({ descripcion: 'escalerilla' }).save(),
      new Auxiliar({ descripcion: 'escritorio' }).save(),
      new Auxiliar({ descripcion: 'esquinero' }).save(),
      new Auxiliar({ descripcion: 'estación de trabajo' }).save(),
      new Auxiliar({ descripcion: 'estante' }).save(),
      new Auxiliar({ descripcion: 'exprimidor de jugo' }).save(),
      new Auxiliar({ descripcion: 'extractor de jugo' }).save(),
      new Auxiliar({ descripcion: 'fichero (tarjetero)' }).save(),
      new Auxiliar({ descripcion: 'fotocopiadora' }).save(),
      new Auxiliar({ descripcion: 'gabinete/rack' }).save(),
      new Auxiliar({ descripcion: 'gabetero para herramientas' }).save(),
      new Auxiliar({ descripcion: 'gradilla de biblioteca' }).save(),
      new Auxiliar({ descripcion: 'licuadora' }).save(),
      new Auxiliar({ descripcion: 'mesa' }).save(),
      new Auxiliar({ descripcion: 'mesa dibujo' }).save(),
      new Auxiliar({ descripcion: 'microondas' }).save(),
      new Auxiliar({ descripcion: 'modular' }).save(),
      new Auxiliar({ descripcion: 'mostrador/mesón' }).save(),
      new Auxiliar({ descripcion: 'mueble colgante' }).save(),
      new Auxiliar({ descripcion: 'mueble generador de tickets' }).save(),
      new Auxiliar({ descripcion: 'mueble para cocina' }).save(),
      new Auxiliar({ descripcion: 'mueble para computadora metálico/madera' }).save(),
      new Auxiliar({ descripcion: 'mueble para equipo de sonido' }).save(),
      new Auxiliar({ descripcion: 'mueble para fotocopiadora' }).save(),
      new Auxiliar({ descripcion: 'mueble porta - botellón de agua' }).save(),
      new Auxiliar({ descripcion: 'mueble porta CPU' }).save(),
      new Auxiliar({ descripcion: 'picadora destructora de papel' }).save(),
      new Auxiliar({ descripcion: 'planoteca' }).save(),
      new Auxiliar({ descripcion: 'porta avisos' }).save(),
      new Auxiliar({ descripcion: 'procesador de alimentos' }).save(),
      new Auxiliar({ descripcion: 'reloj biométrico' }).save(),
      new Auxiliar({ descripcion: 'reloj fichador digital' }).save(),
      new Auxiliar({ descripcion: 'repisa' }).save(),
      new Auxiliar({ descripcion: 'ropero' }).save(),
      new Auxiliar({ descripcion: 'sandwichera' }).save(),
      new Auxiliar({ descripcion: 'secador de manos' }).save(),
      new Auxiliar({ descripcion: 'silla' }).save(),
      new Auxiliar({ descripcion: 'sillón' }).save(),
      new Auxiliar({ descripcion: 'sofá' }).save(),
      new Auxiliar({ descripcion: 'taburete' }).save(),
      new Auxiliar({ descripcion: 'tandem' }).save(),
      new Auxiliar({ descripcion: 'tocador' }).save(),
      new Auxiliar({ descripcion: 'velador' }).save(),
      new Auxiliar({ descripcion: 'vitrina' }).save(),
      //Equipos de computación
      new Auxiliar({ descripcion: 'cpu servidor' }).save(),
      new Auxiliar({ descripcion: 'cpu' }).save(),
      new Auxiliar({ descripcion: 'computador portátil' }).save(),
      new Auxiliar({ descripcion: 'chasis blade' }).save(),
      new Auxiliar({ descripcion: 'data logger' }).save(),
      new Auxiliar({ descripcion: 'duplicador de discos' }).save(),
      new Auxiliar({ descripcion: 'impresora' }).save(),
      new Auxiliar({ descripcion: 'lector código de barras' }).save(),
      new Auxiliar({ descripcion: 'lector (biométrico)' }).save(),
      new Auxiliar({ descripcion: 'monitor' }).save(),
      new Auxiliar({ descripcion: 'modulo transceptor' }).save(),
      new Auxiliar({ descripcion: 'micro controlador plc' }).save(),
      new Auxiliar({ descripcion: 'ploter' }).save(),
      new Auxiliar({ descripcion: 'scanner' }).save(),
      new Auxiliar({ descripcion: 'storage' }).save(),
      //Vehículos livianos 
      new Auxiliar({ descripcion: 'automóvil' }).save(),
      new Auxiliar({ descripcion: 'bus' }).save(),
      new Auxiliar({ descripcion: 'bicicleta' }).save(),
      new Auxiliar({ descripcion: 'camioneta' }).save(),
      new Auxiliar({ descripcion: 'cuadratrack' }).save(),
      new Auxiliar({ descripcion: 'jeep' }).save(),
      new Auxiliar({ descripcion: 'motocicleta' }).save(),
      new Auxiliar({ descripcion: 'microbus' }).save(),
      new Auxiliar({ descripcion: 'vagoneta' }).save(),
      // Equipo médico y de laboratorio
      new Auxiliar({ descripcion: 'absorción atómica' }).save(),
      new Auxiliar({ descripcion: 'acelerador de pie (equipo odontológico)' }).save(),
      new Auxiliar({ descripcion: 'aclinografo (medidor de radiación solar)' }).save(),
      new Auxiliar({ descripcion: 'agitador de laboratorio' }).save(),
      new Auxiliar({ descripcion: 'aguja vicat' }).save(),
      new Auxiliar({ descripcion: 'aire comprimido' }).save(),
      new Auxiliar({ descripcion: 'albedometro' }).save(),
      new Auxiliar({ descripcion: 'alcoholimetro' }).save(),
      new Auxiliar({ descripcion: 'altímetro' }).save(),
      new Auxiliar({ descripcion: 'amperímetro' }).save(),
      new Auxiliar({ descripcion: 'amplificador de medida' }).save(),
      new Auxiliar({ descripcion: 'analizador de gases' }).save(),
      new Auxiliar({ descripcion: 'analizador de humedad' }).save(),
      new Auxiliar({ descripcion: 'analizador de laboratorio' }).save(),
      new Auxiliar({ descripcion: 'analizador de petróleo' }).save(),
      new Auxiliar({ descripcion: 'analizador elementales' }).save(),
      new Auxiliar({ descripcion: 'anemógrafo/anemómetro' }).save(),
      new Auxiliar({ descripcion: 'aparato copa casa grande' }).save(),
      new Auxiliar({ descripcion: 'aparato corte' }).save(),
      new Auxiliar({ descripcion: 'aparato de abdominales' }).save(),
      new Auxiliar({ descripcion: 'aparato de milikan' }).save(),
      new Auxiliar({ descripcion: 'aparato de punto de fusión' }).save(),
      new Auxiliar({ descripcion: 'aparato emisor de rayos x' }).save(),
      new Auxiliar({ descripcion: 'aparato ensayos permeabilidad' }).save(),
      new Auxiliar({ descripcion: 'aparato fuerza centrípeta' }).save(),
      new Auxiliar({ descripcion: 'aparato para tracción cervica' }).save(),
      new Auxiliar({ descripcion: 'aparato vicat' }).save(),
      new Auxiliar({ descripcion: 'aparato termostático' }).save(),
      new Auxiliar({ descripcion: 'articulador' }).save(),
      new Auxiliar({ descripcion: 'articulador multifuncional dental' }).save(),
      new Auxiliar({ descripcion: 'aspirador de laboratorio' }).save(),
      new Auxiliar({ descripcion: 'atenuador' }).save(),
      new Auxiliar({ descripcion: 'audiómetro' }).save(),
      new Auxiliar({ descripcion: 'autoclave' }).save(),
      new Auxiliar({ descripcion: 'balanceador' }).save(),
      new Auxiliar({ descripcion: 'balanza' }).save(),
      new Auxiliar({ descripcion: 'banco de peso' }).save(),
      new Auxiliar({ descripcion: 'banco óptico' }).save(),
      new Auxiliar({ descripcion: 'bañador de oro' }).save(),
      new Auxiliar({ descripcion: 'baño de frotación histológica' }).save(),
      new Auxiliar({ descripcion: 'baño de recirculación, arena' }).save(),
      new Auxiliar({ descripcion: 'baño maría/termostatizador' }).save(),
      new Auxiliar({ descripcion: 'baño ultrasónico' }).save(),
      new Auxiliar({ descripcion: 'barómetro' }).save(),
      new Auxiliar({ descripcion: 'base nivelante' }).save(),
      new Auxiliar({ descripcion: 'bicicleta elíptica' }).save(),
      new Auxiliar({ descripcion: 'biorreactor' }).save(),
      new Auxiliar({ descripcion: 'bloque de calentamiento' }).save(),
      new Auxiliar({ descripcion: 'bomba' }).save(),
      new Auxiliar({ descripcion: 'cabina de trabajo pcr laboratorio' }).save(),
      new Auxiliar({ descripcion: 'caja anestésica' }).save(),
      new Auxiliar({ descripcion: 'caja de skinner' }).save(),
      new Auxiliar({ descripcion: 'calentador de compresas' }).save(),
      new Auxiliar({ descripcion: 'calibrador de medición' }).save(),
      new Auxiliar({ descripcion: 'calorímetro' }).save(),
      new Auxiliar({ descripcion: 'cámara' }).save(),
      new Auxiliar({ descripcion: 'camillas' }).save(),
      new Auxiliar({ descripcion: 'caminadora' }).save(),
      new Auxiliar({ descripcion: 'campana de laboratorio' }).save(),
      new Auxiliar({ descripcion: 'campturador de sonrisa' }).save(), //TODO: me quede en el numero 60 de la lista...

    ])
    console.log('Tabla auxiliar creada')
  } catch (error) {
    logger.error(error)
  }
}
