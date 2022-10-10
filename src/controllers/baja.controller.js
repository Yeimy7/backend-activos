import Baja from '../models/Baja'
import Activo from '../models/Activo'
import { validationResult } from 'express-validator'

export const crearBaja = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  const { motivo_baja, id_activo } = req.body
  try {
    //Guardar datos de Baja
    const activo = await Activo.findOne({ raw: true, where: { id_activo: id_activo } })
    if (!activo) return res.status(404).json({ msg: 'Activo no encontrado' })

    if (activo.id_persona) return res.status(406).json({ msg: 'Debe desvincular el activo para poder dar baja' })

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
    console.log(error);
    res.status(400).json({ msg: 'Hubo un error al intentar registrar baja' })
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
    res.status(500).json({ msg: 'Hubo un error al recuperar datos de los bajas' })
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
    res.status(500).send('Hubo un error')
  }
}
