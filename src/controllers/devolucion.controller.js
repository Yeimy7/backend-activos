import Person from '../models/Person'
import Devolucion from '../models/Devolucion'
import Activo from '../models/Activo'
import Empleado from '../models/Empleado'
import { validationResult } from 'express-validator'

export const crearDevolucion = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  const { motivo_devolucion, fecha_asignacion, id_activo, id_persona } = req.body
  try {
    //Guardar datos de Devolucion
    const activo = await Activo.findOne({ raw: true, where: { id_activo: id_activo } })
    if (!activo) return res.status(404).json({ msg: 'Activo no encontrado' })

    const empleado = await Empleado.findOne({ where: { id_persona: id_persona } })
    if (!empleado) return res.status(404).json({ msg: 'Empleado no encontrado' })

    const persona = await Person.findOne({ where: { id_persona: id_persona } })

    const newDevolucion = {
      motivo_devolucion,
      fecha_asignacion,
      id_activo,
      id_persona
    }

    //Guardar la devolucion y actualizar el activo
    const resultado = await Devolucion.create(newDevolucion)

    res.status(201).json({
      id_devolucion: resultado.id_devolucion,
      fecha_devolucion: resultado.fecha_devolucion,
      motivo_devolucion,
      fecha_asignacion,
      'activo.descripcion_activo': activo.descripcion_activo,
      'emplado.nombres': persona.nombres,
      'empleado.apellidos': persona.apellidos
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: 'Hubo un error al intentar registrar devolucion' })
  }
}
export const obtenerDevoluciones = async (_req, res) => {
  try {
    const devoluciones = await Devolucion.findAll({
      raw: true, include: {
        model: Activo,
        attributes: ['descripcion_activo']
      },
    })
    const datosDevoluciones = await Promise.all(devoluciones.map(async devolucion => {
      const persona = await Person.findOne({ raw: true, where: { id_persona: devolucion.id_persona } })
      return await { 'empleado.nombres': persona.nombres, 'empleado.apellidos': persona.apellidos, ...devolucion }

    }))
    res.status(200).json(datosDevoluciones)
  } catch (error) {
    res.status(500).json({ msg: 'Hubo un error al recuperar datos de los devoluciones' })
  }
}

export const obtenerDevolucionPorId = async (req, res) => {
  try {

    const devolucion = await Devolucion.findOne({
      raw: true, where: { id_devolucion: req.params.devolucionId }, include: {
        model: Activo,
        attributes: ['descripcion_activo']
      },
    })
    const persona = await Person.findOne({ raw: true, where: { id_persona: devolucion.id_persona } })
    const datosDevolucion = await { 'empleado.nombres': persona.nombres, 'empleado.apellidos': persona.apellidos, ...devolucion }
    res.status(200).json(datosDevolucion)
  } catch (error) {
    res.status(500).send('Hubo un error')
  }
}
