import { crearPDF } from '../utils/generarPDF'
import { validationResult } from 'express-validator'
import Activo from '../models/Activo'
import Ambiente from '../models/Ambiente'
import Auxiliar from '../models/Auxiliar'
import Baja from '../models/Baja'
import Cargo from '../models/Cargo'
import Empleado from '../models/Empleado'
import GrupoContable from '../models/GrupoContable'
import Person from '../models/Person'

export const crearBaja = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    let err = x.errores.errors.map(mensaje => (mensaje.msg))
    return res.status(400).json({ msg: err.join(), type: 'error' })
  }
  const { motivo_baja, id_activo } = req.body
  try {
    //Guardar datos de Baja
    const activo = await Activo.findOne({ raw: true, where: { id_activo: id_activo } })
    if (!activo) return res.status(404).json({ msg: 'Activo no encontrado', type: 'error' })

    if (activo.id_persona) return res.status(406).json({ msg: 'Debe desvincular el activo para poder dar baja', type: 'error' })

    const newBaja = {
      motivo_baja,
      id_activo,
    }
    //Guardar la baja y actualizar el activo
    const resultado = await Baja.create(newBaja)

    res.status(201).json({
      id_baja: resultado.id_baja,
      fecha_baja: resultado.fecha_baja,
      motivo_baja,
      'activo.descripcion_activo': activo.descripcion_activo,
    })
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}
export const obtenerBajas = async (_req, res) => {
  try {
    const bajas = await Baja.findAll({
      raw: true, include: {
        model: Activo,
        attributes: ['descripcion_activo']
      },
    })
    res.status(200).json(bajas)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const obtenerBajaPorId = async (req, res) => {
  try {

    const baja = await Baja.findOne({
      raw: true, where: { id_baja: req.params.bajaId }, include: {
        model: Activo,
        attributes: ['descripcion_activo']
      },
    })
    res.status(200).json(baja)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}
export const actaBajaActivo = async (req, res) => {
  //Buscar cargo jefe de unidad de activos fijos 
  const { id_baja } = req.body
  try {
    const baja = await Baja.findOne({ raw: true, where: { id_baja } })
    const activo = await Activo.findOne({
      raw: true, where: { id_activo: baja.id_activo }, include:
        [
          {
            model: Ambiente,
            attributes: ['codigo_ambiente', 'tipo_ambiente']
          },
          {
            model: Auxiliar,
            attributes: ['descripcion_aux']
          },
          {
            model: GrupoContable,
            attributes: ['descripcion_g', 'vida_util', 'coeficiente']
          }
        ]
    })

    const cargo = await Cargo.findOne({ raw: true, where: { descripcion_cargo: 'Jefe de unidad de activos fijos' } })
    const encargado = await Empleado.findOne({ raw: true, where: { id_cargo: cargo.id_cargo } })
    const personaEncargado = await Person.findOne({ raw: true, where: { id_persona: encargado.id_persona } })
    const datosActivo = {
      grupo_contable: activo['grupo_contable.descripcion_g'],
      auxiliar: activo['auxiliar.descripcion_aux'],
      codigo_activo: activo.codigo_activo,
      fecha_ingreso: activo.fecha_ingreso,
      fecha_baja: baja.fecha_baja,
      descripcion_activo: activo.descripcion_activo,
      motivo: baja.motivo_baja,
      encargado: personaEncargado.nombres + ' ' + personaEncargado.apellidos,
      cargo_encargado: cargo.descripcion_cargo
    }
    const pdf = await crearPDF('actaBaja', datosActivo)
    res.contentType('application/pdf');
    res.status(200).send(pdf)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const totalBajas = async (_req, res) => {
  try {
    const totalBajas = await Baja.count()
    res.status(200).json(totalBajas)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}
