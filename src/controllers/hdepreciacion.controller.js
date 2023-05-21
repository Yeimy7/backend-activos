import Hdepreciacion from '../models/HDepreciacion'
import Activo from '../models/Activo'
import { validationResult } from 'express-validator'

export const crearHdepreciacion = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  const { gestion, valor_residual, id_activo } = req.body
  try {
    //Guardar datos del historial de depreciacion
    const activo = await Activo.findOne({ raw: true, where: { id_activo: id_activo } })
    if (!activo) return res.status(404).json({ msg: 'Activo no encontrado' })

    //Guardar el datos de depreciacion y actualizar el activo
    const resultado = await Hdepreciacion.create({gestion, valor_residual, id_activo })

    res.status(201).json(resultado)
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: 'Hubo un error al intentar registrar la hdepreciacion' })
  }
}
export const obtenerHDepreciaciones = async (_req, res) => {
  try {
    const hdepreciaciones = await Hdepreciacion.findAll({
      raw: true, include: {
        model: Activo,
        attributes: ['descripcion_activo', 'codigo_activo']
      },
    })
    res.status(200).json(hdepreciaciones)
  } catch (error) {
    res.status(500).json({ msg: 'Hubo un error al recuperar datos de los historicos de depreciacion' })
  }
}

export const obtenerHdepreciacionPorId = async (req, res) => {
  try {
    const hdepreciacion = await Hdepreciacion.findOne({
      raw: true, where: { id_hdepreciacion: req.params.hdepreciacionId }, include: {
        model: Activo,
        attributes: ['descripcion_activo', 'codigo_activo']
      },
    })
    res.status(200).json(hdepreciacion)
  } catch (error) {
    res.status(500).send('Hubo un error')
  }
}

export const obtenerHdepreciacionPorIdActivo = async (req, res) => {
  try {
    const { id_activo } = req.body

    console.log('*********************************************',id_activo)
    const hdepreciacion = await Hdepreciacion.findAll({
      raw: true, where: { id_activo }
    })
    res.status(200).json(hdepreciacion)
  } catch (error) {
    res.status(500).send('Hubo un error')
  }
}

export const obtenerHdepreciacionPorIdActivoGestion = async (req, res) => {
  try {
    const { gestion, id_activo } = req.body

    const hdepreciacion = await Hdepreciacion.findAll({
      raw: true, where: { id_activo, gestion }
    })
    res.status(200).json(hdepreciacion)
  } catch (error) {
    res.status(500).send('Hubo un error')
  }
}


