import { validationResult } from 'express-validator'
import Area from '../models/Area'

export const crearArea = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    let err = errores.errors.map(mensaje => (mensaje.msg))
    return res.status(400).json({ msg: err.join(), type: 'error' })
  }
  try {
    const areaCreada = await Area.create(req.body)
    res.status(201).json(areaCreada)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const obtenerAreas = async (_req, res) => {
  try {
    const areas = await Area.findAll({ where: { estado: 'A' } })
    res.status(200).json(areas)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const obtenerAreaPorId = async (req, res) => {
  try {
    const area = await Area.findOne({ where: { id_area: req.params.areaId }, attributes: { exclude: ['id_area'] } })
    res.status(200).json(area)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const actualizarAreaPorId = async (req, res) => {
  // Extraer la información del proyecto
  const { nombre_area, codigo_area } = req.body
  try {
    // Revisar el ID
    let area = await Area.findByPk(req.params.areaId)
    let isModified = false
    if (!area) {
      return res.status(404).json({ msg: 'Area no encontrada', type: 'error' })
    }
    if (nombre_area && nombre_area !== area.nombre_area) {
      area.nombre_area = nombre_area
      isModified = true
    }
    if (codigo_area && codigo_area !== area.codigo_area) {
      area.codigo_area = codigo_area
      isModified = true
    }
    let areaActualizada
    if (isModified) {
      areaActualizada = await area.save()
    } else {
      areaActualizada = area
    }
    res.status(200).json(areaActualizada)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const bajaAreaPorId = async (req, res) => {
  try {
    let area = await Area.findByPk(req.params.areaId)

    if (!area) {
      return res.status(404).json({ msg: 'Area no encontrada', type: 'error' })
    }
    area.estado = 'I'
    const bajaArea = await area.save()
    res.status(200).json(bajaArea)
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}