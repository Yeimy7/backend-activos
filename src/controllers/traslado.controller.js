import { crearPDF } from '../utils/generarPDF'
import { validationResult } from 'express-validator'
import Activo from '../models/Activo'
import Ambiente from '../models/Ambiente'
import Cargo from '../models/Cargo'
import Empleado from '../models/Empleado'
import Person from '../models/Person'
import Traslado from '../models/Traslado'

export const crearTraslado = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    let err = errores.errors.map(mensaje => (mensaje.msg))
    return res.status(400).json({ msg: err.join(), type: 'error' })
  }
  const { motivo_traslado, fecha_ocupacion_anterior, id_activo, id_ambiente } = req.body
  try {
    //Guardar datos de Traslado
    const activo = await Activo.findOne({ raw: true, where: { id_activo: id_activo } })
    if (!activo) return res.status(404).json({ msg: 'Activo no encontrado', type: 'error' })

    const ambiente = await Ambiente.findOne({ where: { id_ambiente: id_ambiente } })
    if (!ambiente) return res.status(404).json({ msg: 'Ambiente no encontrado', type: 'error' })

    const newTraslado = {
      motivo_traslado,
      fecha_ocupacion_anterior,
      id_activo,
      id_ambiente
    }

    //Guardar la traslado y actualizar el activo
    const resultado = await Traslado.create(newTraslado)

    res.status(201).json({
      id_traslado: resultado.id_traslado,
      fecha_traslado: resultado.fecha_traslado,
      motivo_traslado,
      fecha_ocupacion_anterior,
      'activo.descripcion_activo': activo.descripcion_activo,
      'ambiente.codigo_ambiente': ambiente.codigo_ambiente,
      'ambiente.tipo_ambiente': ambiente.tipo_ambiente,
    })
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}
export const obtenerTraslados = async (_req, res) => {
  try {
    const traslados = await Traslado.findAll({
      raw: true, include: [
        {
          model: Activo,
          attributes: ['descripcion_activo']
        },
        {
          model: Ambiente,
          attributes: ['codigo_ambiente', 'tipo_ambiente']
        },
      ]
    })
    res.status(200).json(traslados)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const obtenerTrasladoPorId = async (req, res) => {
  try {

    const traslado = await Traslado.findOne({
      raw: true, where: { id_traslado: req.params.trasladoId }, include: [
        {
          model: Activo,
          attributes: ['descripcion_activo']
        },
        {
          model: Ambiente,
          attributes: ['codigo_ambiente', 'tipo_ambiente']
        },
      ]
    })

    res.status(200).json(traslado)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const actaTrasladoActivo = async (req, res) => {
  //Buscar cargo jefe de unidad de activos fijos 
  const { id_traslado } = req.body
  try {
    const traslado = await Traslado.findOne({
      raw: true, where: { id_traslado }, include: [
        {
          model: Ambiente,
          attributes: ['codigo_ambiente', 'tipo_ambiente']
        },
        {
          model: Activo,
          attributes: ['codigo_activo', 'descripcion_activo'],
          include: [
            {
              model: Ambiente,
              attributes: ['codigo_ambiente', 'tipo_ambiente']
            },
            {
              model: Empleado,
              attributes: ['id_persona', 'id_cargo'],
              include: [
                {
                  model: Cargo,
                  attributes: ['descripcion_cargo']
                }
              ]
            },
          ]
        }
      ]
    })

    const persona = await Person.findOne({ raw: true, where: { id_persona: traslado['activo.empleado.id_persona'] } })
    const cargo = await Cargo.findOne({ raw: true, where: { descripcion_cargo: 'Jefe de unidad de activos fijos' } })
    const encargado = await Empleado.findOne({ raw: true, where: { id_cargo: cargo.id_cargo } })
    const personaEncargado = await Person.findOne({ raw: true, where: { id_persona: encargado.id_persona } })
    const datosActivo = {
      codigo_activo: traslado['activo.codigo_activo'],
      descripcion_activo: traslado['activo.descripcion_activo'],
      ambiente_origen: traslado['ambiente.tipo_ambiente'] + ' ' + traslado['ambiente.codigo_ambiente'],
      responsable: persona ? persona.nombres + ' ' + persona.apellidos : 'Sin responsable',
      cargo_responsable: traslado['activo.empleado.cargo.descripcion_cargo'] || 'Sin asignar',
      ambiente_nuevo: traslado['activo.ambiente.tipo_ambiente'] + ' ' + traslado['activo.ambiente.codigo_ambiente'],
      motivo: traslado.motivo_traslado,
      encargado: personaEncargado.nombres + ' ' + personaEncargado.apellidos,
      cargo_encargado: cargo.descripcion_cargo
    }
    const pdf = await crearPDF('actaTraslado', datosActivo)
    res.contentType('application/pdf');
    res.status(200).send(pdf)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}