import { validationResult } from 'express-validator'
import Edificio from '../models/Edificio'

export const crearEdificio = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    let err = x.errores.errors.map(mensaje => (mensaje.msg))
    return res.status(400).json({ msg: err.join(), type: 'error' })
  }
  try {
    const edificioCreado = await Edificio.create(req.body)
    res.status(201).json(edificioCreado)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const obtenerEdificios = async (_req, res) => {
  try {
    const edificios = await Edificio.findAll({ where: { estado: 'A' } })
    res.status(200).json(edificios)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const obtenerEdificioPorId = async (req, res) => {
  try {
    const edificio = await Edificio.findOne({ where: { id_edificio: req.params.edificioId } })
    res.status(200).json(edificio)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const actualizarEdificioPorId = async (req, res) => {
  // Extraer la información del proyecto
  const { nombre_edificio } = req.body
  try {
    // Revisar el ID
    let edificio = await Edificio.findByPk(req.params.edificioId)
    let isModified = false
    // Si el edificio existe o no
    if (!edificio) {
      return res.status(404).json({ msg: 'Edificio no encontrado', type: 'error' })
    }
    if (nombre_edificio && nombre_edificio !== edificio.nombre_edificio) {
      edificio.nombre_edificio = nombre_edificio
      isModified = true
    }
    let edificioActualizado
    if (isModified) {
      edificioActualizado = await edificio.save()
    } else {
      edificioActualizado = edificio
    }
    res.status(200).json(edificioActualizado)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const bajaEdificioPorId = async (req, res) => {
  try {
    let edificio = await Edificio.findByPk(req.params.edificioId)

    if (!edificio) {
      return res.status(404).json({ msg: 'Edificio no encontrado', type: 'error' })
    }
    edificio.estado = 'I'
    const bajaEdificio = await edificio.save()
    res.status(200).json(bajaEdificio)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}