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
    // const [count] = await conectarDB.query(`SELECT count(*) FROM information_schema.TABLES WHERE (TABLE_SCHEMA = 'activos') AND (TABLE_NAME = 'grupo_contable')`, { type: QueryTypes.SELECT });
    // if (Object.values(count)[0] > 0) return

    await Promise.all([
      new GrupoContable({ descripcion_g: 'Muebles y enseres de oficina', vida_util: 10, coeficiente: 10 }).save(),
      new GrupoContable({ descripcion_g: 'Enseres', vida_util: 10, coeficiente: 10 }).save(),
      new GrupoContable({ descripcion_g: 'Equipos de computación', vida_util: 4, coeficiente: 25 }).save(),
      new GrupoContable({ descripcion_g: 'Equipos médicos', vida_util: 4, coeficiente: 25 }).save(),
      new GrupoContable({ descripcion_g: 'Equipos odontológicos', vida_util: 4, coeficiente: 25 }).save(),
      new GrupoContable({ descripcion_g: 'Equipos', vida_util: 4, coeficiente: 25 }).save(),
      // new GrupoContable({ descripcion_g: 'Vehículos automotores', vida_util: 5, coeficiente: 20 }).save(),
      // new GrupoContable({ descripcion_g: 'Maquinaria para la construcción', vida_util: 5, coeficiente: 20 }).save(),
      // new GrupoContable({ descripcion_g: 'Maquinaria agrícola', vida_util: 4, coeficiente: 25 }).save(),
      // new GrupoContable({ descripcion_g: 'Herramientas en general', vida_util: 4, coeficiente: 25 }).save(),
      // new GrupoContable({ descripcion_g: 'Alambrados, tranqueras y vallas', vida_util: 10, coeficiente: 10 }).save(),
      // new GrupoContable({ descripcion_g: 'Viviendas para el personal', vida_util: 20, coeficiente: 5 }).save(),
      // new GrupoContable({ descripcion_g: 'Muebles y enseres en las viviendas para el personal', vida_util: 10, coeficiente: 10 }).save(),
      // new GrupoContable({ descripcion_g: 'Tinglados y cobertizos de madera', vida_util: 5, coeficiente: 20 }).save(),
      // new GrupoContable({ descripcion_g: 'Tinglados y cobertizos de metal', vida_util: 10, coeficiente: 10 }).save(),
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
      new Auxiliar({ descripcion_aux: 'alacena' }).save(),
      new Auxiliar({ descripcion_aux: 'archivador' }).save(),
      new Auxiliar({ descripcion_aux: 'armario' }).save(),
      new Auxiliar({ descripcion_aux: 'banco' }).save(),
      new Auxiliar({ descripcion_aux: 'batidora' }).save(),
      new Auxiliar({ descripcion_aux: 'caja fuerte' }).save(),
      new Auxiliar({ descripcion_aux: 'caja registradora' }).save(),
      new Auxiliar({ descripcion_aux: 'carro móvil' }).save(),
      new Auxiliar({ descripcion_aux: 'casillero' }).save(),
      new Auxiliar({ descripcion_aux: 'catre' }).save(),
      new Auxiliar({ descripcion_aux: 'colgador' }).save(),
      new Auxiliar({ descripcion_aux: 'cómoda' }).save(),
      new Auxiliar({ descripcion_aux: 'credensa' }).save(),
      new Auxiliar({ descripcion_aux: 'cuna' }).save(),
      new Auxiliar({ descripcion_aux: 'dispensador de agua' }).save(),
      new Auxiliar({ descripcion_aux: 'diván' }).save(),
      new Auxiliar({ descripcion_aux: 'duplicador digital' }).save(),
      new Auxiliar({ descripcion_aux: 'escalerilla' }).save(),
      new Auxiliar({ descripcion_aux: 'escritorio' }).save(),
      new Auxiliar({ descripcion_aux: 'esquinero' }).save(),
      new Auxiliar({ descripcion_aux: 'estación de trabajo' }).save(),
      new Auxiliar({ descripcion_aux: 'estante' }).save(),
      new Auxiliar({ descripcion_aux: 'exprimidor de jugo' }).save(),
      new Auxiliar({ descripcion_aux: 'extractor de jugo' }).save(),
      new Auxiliar({ descripcion_aux: 'fichero (tarjetero)' }).save(),
      new Auxiliar({ descripcion_aux: 'fotocopiadora' }).save(),
      new Auxiliar({ descripcion_aux: 'gabinete/rack' }).save(),
      new Auxiliar({ descripcion_aux: 'gabetero para herramientas' }).save(),
      new Auxiliar({ descripcion_aux: 'gradilla de biblioteca' }).save(),
      new Auxiliar({ descripcion_aux: 'licuadora' }).save(),
      new Auxiliar({ descripcion_aux: 'mesa' }).save(),
      new Auxiliar({ descripcion_aux: 'mesa dibujo' }).save(),
      new Auxiliar({ descripcion_aux: 'microondas' }).save(),
      new Auxiliar({ descripcion_aux: 'modular' }).save(),
      new Auxiliar({ descripcion_aux: 'mostrador/mesón' }).save(),
      new Auxiliar({ descripcion_aux: 'mueble colgante' }).save(),
      new Auxiliar({ descripcion_aux: 'mueble generador de tickets' }).save(),
      new Auxiliar({ descripcion_aux: 'mueble para cocina' }).save(),
      new Auxiliar({ descripcion_aux: 'mueble para computadora metálico/madera' }).save(),
      new Auxiliar({ descripcion_aux: 'mueble para equipo de sonido' }).save(),
      new Auxiliar({ descripcion_aux: 'mueble para fotocopiadora' }).save(),
      new Auxiliar({ descripcion_aux: 'mueble porta - botellón de agua' }).save(),
      new Auxiliar({ descripcion_aux: 'mueble porta CPU' }).save(),
      new Auxiliar({ descripcion_aux: 'picadora destructora de papel' }).save(),
      new Auxiliar({ descripcion_aux: 'planoteca' }).save(),
      new Auxiliar({ descripcion_aux: 'porta avisos' }).save(),
      new Auxiliar({ descripcion_aux: 'procesador de alimentos' }).save(),
      new Auxiliar({ descripcion_aux: 'reloj biométrico' }).save(),
      new Auxiliar({ descripcion_aux: 'reloj fichador digital' }).save(),
      new Auxiliar({ descripcion_aux: 'repisa' }).save(),
      new Auxiliar({ descripcion_aux: 'ropero' }).save(),
      new Auxiliar({ descripcion_aux: 'sandwichera' }).save(),
      new Auxiliar({ descripcion_aux: 'secador de manos' }).save(),
      new Auxiliar({ descripcion_aux: 'silla' }).save(),
      new Auxiliar({ descripcion_aux: 'sillón' }).save(),
      new Auxiliar({ descripcion_aux: 'sofá' }).save(),
      new Auxiliar({ descripcion_aux: 'taburete' }).save(),
      new Auxiliar({ descripcion_aux: 'tandem' }).save(),
      new Auxiliar({ descripcion_aux: 'tocador' }).save(),
      new Auxiliar({ descripcion_aux: 'velador' }).save(),
      new Auxiliar({ descripcion_aux: 'vitrina' }).save(),
      new Auxiliar({ descripcion_aux: 'alfombra' }).save(),
      //Enceres
      new Auxiliar({ descripcion_aux: 'tinglado' }).save(),
      new Auxiliar({ descripcion_aux: 'estufa' }).save(),
      new Auxiliar({ descripcion_aux: 'estante de madera' }).save(),
      //Equipos
      new Auxiliar({ descripcion_aux: 'radio' }).save(),
      new Auxiliar({ descripcion_aux: 'garrafas de gas licuado' }).save(),
      new Auxiliar({ descripcion_aux: 'silla de ruedas' }).save(),
      new Auxiliar({ descripcion_aux: 'estetoscopio' }).save(),
      new Auxiliar({ descripcion_aux: 'micrófono' }).save(),
      new Auxiliar({ descripcion_aux: 'calefón' }).save(),
      new Auxiliar({ descripcion_aux: 'termoventilador' }).save(),
      new Auxiliar({ descripcion_aux: 'extinguidor' }).save(),
      new Auxiliar({ descripcion_aux: 'olla a presión' }).save(),
      new Auxiliar({ descripcion_aux: 'horno industrial' }).save(),
      new Auxiliar({ descripcion_aux: 'amasadora' }).save(),
      new Auxiliar({ descripcion_aux: 'equipo de cocina' }).save(),
      new Auxiliar({ descripcion_aux: 'bandeja de horno' }).save(),
      new Auxiliar({ descripcion_aux: 'equipo de computación' }).save(),
      new Auxiliar({ descripcion_aux: 'marcador biométrico' }).save(),
      new Auxiliar({ descripcion_aux: 'plastificadora' }).save(),
      new Auxiliar({ descripcion_aux: 'radio portátil' }).save(),
      new Auxiliar({ descripcion_aux: 'calefactor' }).save(),
      new Auxiliar({ descripcion_aux: 'radiador' }).save(),
      new Auxiliar({ descripcion_aux: 'parlante' }).save(),
      new Auxiliar({ descripcion_aux: 'ventilador' }).save(),
      new Auxiliar({ descripcion_aux: 'tester' }).save(),


      //Equipos de computación
      new Auxiliar({ descripcion_aux: 'cpu servidor' }).save(),
      new Auxiliar({ descripcion_aux: 'cpu' }).save(),
      new Auxiliar({ descripcion_aux: 'computador portátil' }).save(),
      new Auxiliar({ descripcion_aux: 'chasis blade' }).save(),
      new Auxiliar({ descripcion_aux: 'data logger' }).save(),
      new Auxiliar({ descripcion_aux: 'duplicador de discos' }).save(),
      new Auxiliar({ descripcion_aux: 'impresora' }).save(),
      new Auxiliar({ descripcion_aux: 'lector código de barras' }).save(),
      new Auxiliar({ descripcion_aux: 'lector (biométrico)' }).save(),
      new Auxiliar({ descripcion_aux: 'monitor' }).save(),
      new Auxiliar({ descripcion_aux: 'modulo transceptor' }).save(),
      new Auxiliar({ descripcion_aux: 'micro controlador plc' }).save(),
      new Auxiliar({ descripcion_aux: 'ploter' }).save(),
      new Auxiliar({ descripcion_aux: 'scanner' }).save(),
      new Auxiliar({ descripcion_aux: 'storage' }).save(),
      new Auxiliar({ descripcion_aux: 'mouse' }).save(),
      //Vehículos livianos 
      new Auxiliar({ descripcion_aux: 'automóvil' }).save(),
      new Auxiliar({ descripcion_aux: 'bus' }).save(),
      new Auxiliar({ descripcion_aux: 'bicicleta' }).save(),
      new Auxiliar({ descripcion_aux: 'camioneta' }).save(),
      new Auxiliar({ descripcion_aux: 'cuadratrack' }).save(),
      new Auxiliar({ descripcion_aux: 'jeep' }).save(),
      new Auxiliar({ descripcion_aux: 'motocicleta' }).save(),
      new Auxiliar({ descripcion_aux: 'microbus' }).save(),
      new Auxiliar({ descripcion_aux: 'vagoneta' }).save(),
      // Equipo médico y de laboratorio
      new Auxiliar({ descripcion_aux: 'absorción atómica' }).save(),
      new Auxiliar({ descripcion_aux: 'acelerador de pie (equipo odontológico)' }).save(),
      new Auxiliar({ descripcion_aux: 'aclinografo (medidor de radiación solar)' }).save(),
      new Auxiliar({ descripcion_aux: 'agitador de laboratorio' }).save(),
      new Auxiliar({ descripcion_aux: 'aguja vicat' }).save(),
      new Auxiliar({ descripcion_aux: 'aire comprimido' }).save(),
      new Auxiliar({ descripcion_aux: 'albedometro' }).save(),
      new Auxiliar({ descripcion_aux: 'alcoholimetro' }).save(),
      new Auxiliar({ descripcion_aux: 'altímetro' }).save(),
      new Auxiliar({ descripcion_aux: 'amperímetro' }).save(),
      new Auxiliar({ descripcion_aux: 'amplificador de medida' }).save(),
      new Auxiliar({ descripcion_aux: 'analizador de gases' }).save(),
      new Auxiliar({ descripcion_aux: 'analizador de humedad' }).save(),
      new Auxiliar({ descripcion_aux: 'analizador de laboratorio' }).save(),
      new Auxiliar({ descripcion_aux: 'analizador de petróleo' }).save(),
      new Auxiliar({ descripcion_aux: 'analizador elementales' }).save(),
      new Auxiliar({ descripcion_aux: 'anemógrafo/anemómetro' }).save(),
      new Auxiliar({ descripcion_aux: 'aparato copa casa grande' }).save(),
      new Auxiliar({ descripcion_aux: 'aparato corte' }).save(),
      new Auxiliar({ descripcion_aux: 'aparato de abdominales' }).save(),
      new Auxiliar({ descripcion_aux: 'aparato de milikan' }).save(),
      new Auxiliar({ descripcion_aux: 'aparato de punto de fusión' }).save(),
      new Auxiliar({ descripcion_aux: 'aparato emisor de rayos x' }).save(),
      new Auxiliar({ descripcion_aux: 'aparato ensayos permeabilidad' }).save(),
      new Auxiliar({ descripcion_aux: 'aparato fuerza centrípeta' }).save(),
      new Auxiliar({ descripcion_aux: 'aparato para tracción cervica' }).save(),
      new Auxiliar({ descripcion_aux: 'aparato vicat' }).save(),
      new Auxiliar({ descripcion_aux: 'aparato termostático' }).save(),
      new Auxiliar({ descripcion_aux: 'articulador' }).save(),
      new Auxiliar({ descripcion_aux: 'articulador multifuncional dental' }).save(),
      new Auxiliar({ descripcion_aux: 'aspirador de laboratorio' }).save(),
      new Auxiliar({ descripcion_aux: 'atenuador' }).save(),
      new Auxiliar({ descripcion_aux: 'audiómetro' }).save(),
      new Auxiliar({ descripcion_aux: 'autoclave' }).save(),
      new Auxiliar({ descripcion_aux: 'balanceador' }).save(),
      new Auxiliar({ descripcion_aux: 'balanza' }).save(),
      new Auxiliar({ descripcion_aux: 'banco de peso' }).save(),
      new Auxiliar({ descripcion_aux: 'banco óptico' }).save(),
      new Auxiliar({ descripcion_aux: 'bañador de oro' }).save(),
      new Auxiliar({ descripcion_aux: 'baño de frotación histológica' }).save(),
      new Auxiliar({ descripcion_aux: 'baño de recirculación, arena' }).save(),
      new Auxiliar({ descripcion_aux: 'baño maría/termostatizador' }).save(),
      new Auxiliar({ descripcion_aux: 'baño ultrasónico' }).save(),
      new Auxiliar({ descripcion_aux: 'barómetro' }).save(),
      new Auxiliar({ descripcion_aux: 'base nivelante' }).save(),
      new Auxiliar({ descripcion_aux: 'bicicleta elíptica' }).save(),
      new Auxiliar({ descripcion_aux: 'biorreactor' }).save(),
      new Auxiliar({ descripcion_aux: 'bloque de calentamiento' }).save(),
      new Auxiliar({ descripcion_aux: 'bomba' }).save(),
      new Auxiliar({ descripcion_aux: 'cabina de trabajo pcr laboratorio' }).save(),
      new Auxiliar({ descripcion_aux: 'caja anestésica' }).save(),
      new Auxiliar({ descripcion_aux: 'caja de skinner' }).save(),
      new Auxiliar({ descripcion_aux: 'calentador de compresas' }).save(),
      new Auxiliar({ descripcion_aux: 'calibrador de medición' }).save(),
      new Auxiliar({ descripcion_aux: 'calorímetro' }).save(),
      new Auxiliar({ descripcion_aux: 'cámara' }).save(),
      new Auxiliar({ descripcion_aux: 'camillas' }).save(),
      new Auxiliar({ descripcion_aux: 'caminadora' }).save(),
      new Auxiliar({ descripcion_aux: 'campana de laboratorio' }).save(),
      new Auxiliar({ descripcion_aux: 'campturador de sonrisa' }).save(), //TODO: me quede en el numero 60 de la lista...
      new Auxiliar({ descripcion_aux: 'estimulador' }).save(), //TODO: me quede en el numero 60 de la lista...
      new Auxiliar({ descripcion_aux: 'colchoneta' }).save(), //TODO: me quede en el numero 60 de la lista...
      new Auxiliar({ descripcion_aux: 'lámpara de examen' }).save(), //TODO: me quede en el numero 60 de la lista...
      new Auxiliar({ descripcion_aux: 'termómetro' }).save(), //TODO: me quede en el numero 60 de la lista...
      new Auxiliar({ descripcion_aux: 'tanque de oxígeno' }).save(), //TODO: me quede en el numero 60 de la lista...
      new Auxiliar({ descripcion_aux: 'bomba de hidromasaje' }).save(), //TODO: me quede en el numero 60 de la lista...
      new Auxiliar({ descripcion_aux: 'termotanque' }).save(), //TODO: me quede en el numero 60 de la lista...
      new Auxiliar({ descripcion_aux: 'resucitador manual' }).save(), //TODO: me quede en el numero 60 de la lista...
      new Auxiliar({ descripcion_aux: 'lámpara infrarojo' }).save(), //TODO: me quede en el numero 60 de la lista...
      new Auxiliar({ descripcion_aux: 'bicicleta ergométrica' }).save(), //TODO: me quede en el numero 60 de la lista...
      new Auxiliar({ descripcion_aux: 'camilla' }).save(), //TODO: me quede en el numero 60 de la lista...
      new Auxiliar({ descripcion_aux: 'oxímetro de pulso' }).save(), //TODO: me quede en el numero 60 de la lista...
      new Auxiliar({ descripcion_aux: 'hidromasaje' }).save(), //TODO: me quede en el numero 60 de la lista...
      new Auxiliar({ descripcion_aux: 'bicicleta horizontal' }).save(), //TODO: me quede en el numero 60 de la lista...
      new Auxiliar({ descripcion_aux: 'balanza mecánica' }).save(), //TODO: me quede en el numero 60 de la lista...
      new Auxiliar({ descripcion_aux: 'plantígrafo' }).save(), //TODO: me quede en el numero 60 de la lista...
      new Auxiliar({ descripcion_aux: 'podoscopio' }).save(), //TODO: me quede en el numero 60 de la lista...
      new Auxiliar({ descripcion_aux: 'andador de aluminio' }).save(), //TODO: me quede en el numero 60 de la lista...
      new Auxiliar({ descripcion_aux: 'equipo de ultrasonido odontolódico' }).save(), //TODO: me quede en el numero 60 de la lista...
      new Auxiliar({ descripcion_aux: 'esterilizador' }).save(), //TODO: me quede en el numero 60 de la lista...
      new Auxiliar({ descripcion_aux: 'bandeja metálica' }).save(), //TODO: me quede en el numero 60 de la lista...

    ])
    console.log('Tabla auxiliar creada')
  } catch (error) {
    logger.error(error)
  }
}
