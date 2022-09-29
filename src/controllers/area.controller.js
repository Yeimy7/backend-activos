import Area from '../models/Area'
import { validationResult } from 'express-validator'

export const crearArea = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    const areaCreada = await Area.create(req.body)
    res.status(201).json(areaCreada)
  } catch (error) {
    res.status(500).send('Hubo un error')
  }
}

export const obtenerAreas = async (_req, res) => {
  try {
    const areas = await Area.findAll({ where: { estado: 'A' } })
    res.status(200).json(areas)
  } catch (error) {
    res.status(500).send('Hubo un error')
  }
}

export const obtenerAreaPorId = async (req, res) => {
  try {
    const area = await Area.findOne({ where: { id_area: req.params.areaId }, attributes: { exclude: ['id_area'] } })
    res.status(200).json(area)
  } catch (error) {
    res.status(500).send('Hubo un error')
  }
}

export const actualizarAreaPorId = async (req, res) => {
  // Extraer la información del proyecto
  const { nombre_area, codigo_area } = req.body
  try {
    // Revisar el ID
    let area = await Area.findByPk(req.params.areaId)
    let isModified = false
    // Si el proyecto existe o no
    if (!area) {
      return res.status(404).json({ msg: 'Area no encontrada' })
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
    res.status(500).send('Error en el servidor')
  }
}

export const bajaAreaPorId = async (req, res) => {
  try {
    let area = await Area.findByPk(req.params.areaId)

    if (!area) {
      return res.status(404).json({ msg: 'Area no encontrada' })
    }
    area.estado = 'I'
    const bajaArea = await area.save()
    res.status(200).json(bajaArea)
  } catch (error) {
    console.log(error)
    res.status(500).send('Error en el servidor')
  }
}