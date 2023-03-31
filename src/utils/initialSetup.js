import * as logger from '../utils/logger'
import { QueryTypes } from 'sequelize'
import conectarDB from '../config/db'
import Role from '../models/Role'
import GrupoContable from '../models/GrupoContable'
import Auxiliar from '../models/Auxiliar'
import Edificio from '../models/Edificio'
import Piso from '../models/Piso'
import Ambiente from '../models/Ambiente'

export const createRoles = async () => {
  await Role.estimated
  try {
    const [count] = await conectarDB.query(`SELECT count(*) FROM information_schema.TABLES WHERE (TABLE_SCHEMA = 'activos') AND (TABLE_NAME = 'rol')`, { type: QueryTypes.SELECT });
    if (Object.values(count)[0] > 0) return

    await Promise.all([
      new Role({ nombre_rol: 'Administrador' }).save(),
      new Role({ nombre_rol: 'Super-admin' }).save(),
      new Role({ nombre_rol: 'Custodio' }).save()
    ])
    console.log('Tabla Rol creada')
  } catch (error) {
    logger.error(error)
  }
}

export const createEdificio = async () => {
  await Edificio.estimated
  try {
    const [count] = await conectarDB.query(`SELECT count(*) FROM information_schema.TABLES WHERE (TABLE_SCHEMA = 'activos') AND (TABLE_NAME = 'edificio')`, { type: QueryTypes.SELECT });
    if (Object.values(count)[0] > 0) return

    await Promise.all([
      new Edificio({ nombre_edificio: 'Administracion' }).save(),
      new Edificio({ nombre_edificio: 'Centro Educativo' }).save(),
      new Edificio({ nombre_edificio: 'Hospital' }).save()
    ])
    console.log('Tabla Edificio creada')
  } catch (error) {
    logger.error(error)
  }
}

export const createPiso = async () => {
  await Piso.estimated
  try {
    const [count] = await conectarDB.query(`SELECT count(*) FROM information_schema.TABLES WHERE (TABLE_SCHEMA = 'activos') AND (TABLE_NAME = 'piso')`, { type: QueryTypes.SELECT });
    if (Object.values(count)[0] > 0) return
    const adm = await Edificio.findOne({ raw: true, where: { nombre_edificio: 'Administracion' } })
    const cedu = await Edificio.findOne({ raw: true, where: { nombre_edificio: 'Centro Educativo' } })
    const hosp = await Edificio.findOne({ raw: true, where: { nombre_edificio: 'Hospital' } })
    await Promise.all([
      new Piso({ codigo_piso: 'A1', id_edificio: adm.id_edificio }).save(),
      new Piso({ codigo_piso: 'A2', id_edificio: adm.id_edificio }).save(),
      new Piso({ codigo_piso: 'A3', id_edificio: adm.id_edificio }).save(),
      new Piso({ codigo_piso: 'A4', id_edificio: adm.id_edificio }).save(),
      new Piso({ codigo_piso: 'A5', id_edificio: adm.id_edificio }).save(),

      new Piso({ codigo_piso: 'C1', id_edificio: cedu.id_edificio }).save(),
      new Piso({ codigo_piso: 'C2', id_edificio: cedu.id_edificio }).save(),
      new Piso({ codigo_piso: 'C3', id_edificio: cedu.id_edificio }).save(),
      new Piso({ codigo_piso: 'C4', id_edificio: cedu.id_edificio }).save(),

      new Piso({ codigo_piso: 'M1', id_edificio: hosp.id_edificio }).save(),
      new Piso({ codigo_piso: 'M2', id_edificio: hosp.id_edificio }).save(),
      new Piso({ codigo_piso: 'M3', id_edificio: hosp.id_edificio }).save(),
      new Piso({ codigo_piso: 'M4', id_edificio: hosp.id_edificio }).save(),
      new Piso({ codigo_piso: 'M5', id_edificio: hosp.id_edificio }).save(),
    ])
    console.log('Tabla Piso creada')
  } catch (error) {
    logger.error(error)
  }
}

export const createAmbiente = async () => {
  await Ambiente.estimated
  try {
    const [count] = await conectarDB.query(`SELECT count(*) FROM information_schema.TABLES WHERE (TABLE_SCHEMA = 'activos') AND (TABLE_NAME = 'ambiente')`, { type: QueryTypes.SELECT });
    if (Object.values(count)[0] > 0) return
    const a1 = await Piso.findOne({ raw: true, where: { codigo_piso: 'A1' } })
    const a2 = await Piso.findOne({ raw: true, where: { codigo_piso: 'A2' } })
    const a3 = await Piso.findOne({ raw: true, where: { codigo_piso: 'A3' } })

    const c1 = await Piso.findOne({ raw: true, where: { codigo_piso: 'C1' } })
    const c2 = await Piso.findOne({ raw: true, where: { codigo_piso: 'C2' } })
    const c3 = await Piso.findOne({ raw: true, where: { codigo_piso: 'C3' } })

    const m1 = await Piso.findOne({ raw: true, where: { codigo_piso: 'M1' } })
    const m2 = await Piso.findOne({ raw: true, where: { codigo_piso: 'M2' } })
    const m3 = await Piso.findOne({ raw: true, where: { codigo_piso: 'M3' } })



    await Promise.all([
      new Ambiente({ codigo_ambiente: 'O1-1', tipo_ambiente: 'oficina', id_piso: a1.id_piso }).save(),
      new Ambiente({ codigo_ambiente: 'O2-1', tipo_ambiente: 'oficina', id_piso: a1.id_piso }).save(),
      new Ambiente({ codigo_ambiente: 'O1-2', tipo_ambiente: 'oficina', id_piso: a2.id_piso }).save(),
      new Ambiente({ codigo_ambiente: 'O1-3', tipo_ambiente: 'oficina', id_piso: a3.id_piso }).save(),
      new Ambiente({ codigo_ambiente: 'O2-3', tipo_ambiente: 'oficina', id_piso: a3.id_piso }).save(),

      new Ambiente({ codigo_ambiente: 'C1-1', tipo_ambiente: 'aula educativa', id_piso: c1.id_piso }).save(),
      new Ambiente({ codigo_ambiente: 'C1-2', tipo_ambiente: 'aula educativa', id_piso: c2.id_piso }).save(),
      new Ambiente({ codigo_ambiente: 'C2-2', tipo_ambiente: 'aula educativa', id_piso: c2.id_piso }).save(),
      new Ambiente({ codigo_ambiente: 'C1-3', tipo_ambiente: 'aula educativa', id_piso: c3.id_piso }).save(),

      new Ambiente({ codigo_ambiente: 'M1-3', tipo_ambiente: 'consultorio medico', id_piso: m3.id_piso }).save(),
      new Ambiente({ codigo_ambiente: 'M2-3', tipo_ambiente: 'consultorio medico', id_piso: m3.id_piso }).save(),
      new Ambiente({ codigo_ambiente: 'M1-2', tipo_ambiente: 'consultorio medico', id_piso: m2.id_piso }).save(),
      new Ambiente({ codigo_ambiente: 'M2-2', tipo_ambiente: 'consultorio medico', id_piso: m2.id_piso }).save(),
      new Ambiente({ codigo_ambiente: 'M1-1', tipo_ambiente: 'consultorio medico', id_piso: m1.id_piso }).save(),
    ])
    console.log('Tabla Ambiente creada')
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
      new GrupoContable({ descripcion_g: 'Muebles y enseres de oficina', vida_util: 10, coeficiente: 10 }).save(),
      new GrupoContable({ descripcion_g: 'Maquinaria en general', vida_util: 8, coeficiente: 12.5 }).save(),
      new GrupoContable({ descripcion_g: 'Equipos e instalaciones', vida_util: 8, coeficiente: 12.5 }).save(),
      new GrupoContable({ descripcion_g: 'Vehículos automotores', vida_util: 5, coeficiente: 20 }).save(),
      new GrupoContable({ descripcion_g: 'Maquinaria para la construcción', vida_util: 5, coeficiente: 20 }).save(),
      new GrupoContable({ descripcion_g: 'Maquinaria agrícola', vida_util: 4, coeficiente: 25 }).save(),
      new GrupoContable({ descripcion_g: 'Herramientas en general', vida_util: 4, coeficiente: 25 }).save(),
      new GrupoContable({ descripcion_g: 'Equipos de computación', vida_util: 4, coeficiente: 25 }).save(),
      new GrupoContable({ descripcion_g: 'Alambrados, tranqueras y vallas', vida_util: 10, coeficiente: 10 }).save(),
      new GrupoContable({ descripcion_g: 'Viviendas para el personal', vida_util: 20, coeficiente: 5 }).save(),
      new GrupoContable({ descripcion_g: 'Muebles y enseres en las viviendas para el personal', vida_util: 10, coeficiente: 10 }).save(),
      new GrupoContable({ descripcion_g: 'Tinglados y cobertizos de madera', vida_util: 5, coeficiente: 20 }).save(),
      new GrupoContable({ descripcion_g: 'Tinglados y cobertizos de metal', vida_util: 10, coeficiente: 10 }).save(),
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
