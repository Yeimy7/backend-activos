import Traslado from '../models/Traslado'
import Activo from '../models/Activo'
import { validationResult } from 'express-validator'
import Ambiente from '../models/Ambiente'

export const crearTraslado = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  const { motivo_traslado, fecha_ocupacion_anterior, id_activo, id_ambiente } = req.body
  try {
    //Guardar datos de Traslado
    const activo = await Activo.findOne({ raw: true, where: { id_activo: id_activo } })
    if (!activo) return res.status(404).json({ msg: 'Activo no encontrado' })

    const ambiente = await Ambiente.findOne({ where: { id_ambiente: id_ambiente } })
    if (!ambiente) return res.status(404).json({ msg: 'Ambiente no encontrado' })

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
    console.log(error);
    res.status(400).json({ msg: 'Hubo un error al intentar registrar traslado' })
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
    res.status(500).json({ msg: 'Hubo un error al recuperar datos de los traslados' })
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
    res.status(500).send('Hubo un error')
  }
}
