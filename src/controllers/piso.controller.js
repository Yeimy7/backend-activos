import Piso from '../models/Piso'
import { validationResult } from 'express-validator'

export const crearPiso = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    const pisoCreado = await Piso.create(req.body)
    res.status(201).json(pisoCreado)
  } catch (error) {
    res.status(500).send('Hubo un error')
  }
}

export const obtenerPisos = async (_req, res) => {
  try {
    const pisos = await Piso.findAll({ where: { estado: 'A' } })
    res.status(200).json(pisos)
  } catch (error) {
    res.status(500).send('Hubo un error')
  }
}

export const obtenerPisoPorId = async (req, res) => {
  try {
    const piso = await Piso.findOne({ where: { id_piso: req.params.pisoId }, attributes: { exclude: ['id_piso'] } })
    res.status(200).json(piso)
  } catch (error) {
    res.status(500).send('Hubo un error')
  }
}

export const actualizarPisoPorId = async (req, res) => {
  // Extraer la información del proyecto
  const { codigo_piso } = req.body
  try {
    // Revisar el ID
    let piso = await Piso.findByPk(req.params.pisoId)
    let isModified = false
    // Si el piso existe o no
    if (!piso) {
      return res.status(404).json({ msg: 'Piso no encontrado' })
    }
    if (codigo_piso && codigo_piso !== piso.codigo_piso) {
      piso.codigo_piso = codigo_piso
      isModified = true
    }
    let pisoActualizado
    if (isModified) {
      pisoActualizado = await piso.save()
    } else {
      pisoActualizado = piso
    }
    res.status(200).json(pisoActualizado)
  } catch (error) {
    res.status(500).send('Error en el servidor')
  }
}

export const bajaPisoPorId = async (req, res) => {
  try {
    let piso = await Piso.findByPk(req.params.pisoId)

    if (!piso) {
      return res.status(404).json({ msg: 'Piso no encontrado' })
    }
    piso.estado = 'I'
    const bajaPiso = await piso.save()
    res.status(200).json(bajaPiso)
  } catch (error) {
    console.log(error)
    res.status(500).send('Error en el servidor')
  }
}

export const pisosPorEdificio = (req, res) => {
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }

  const { id_piso } = req.body;
  try {
    const pisos = await Piso.findAll({ where: { estado: 'A', id_piso } })
    res.status(200).json(pisos)
  } catch (error) {
    res.status(500).send('Hubo un error')
  }
}