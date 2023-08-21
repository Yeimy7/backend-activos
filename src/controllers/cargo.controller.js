import { validationResult } from 'express-validator'
import Area from '../models/Area'
import Cargo from '../models/Cargo'

export const crearCargo = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    let err = errores.errors.map(mensaje => (mensaje.msg))
    return res.status(400).json({ msg: err.join(), type: 'error' })
  }
  const { descripcion_cargo, nombre_area } = req.body
  try {
    const area = await Area.findOne({ where: { nombre_area: nombre_area } })
    const newCargo = {
      descripcion_cargo, id_area: area.id_area,
    }
    const cargoCreado = await Cargo.create(newCargo)

    res.status(201).json({ id_cargo: cargoCreado.id_cargo, descripcion_cargo, "area.nombre_area": nombre_area })
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const obtenerCargos = async (_req, res) => {
  try {
    const cargos = await Cargo.findAll({ raw: true, where: { estado: 'A' }, attributes: { exclude: ['id_area'] }, include: Area, order: ['descripcion_cargo'] })
    res.status(200).json(cargos)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const obtenerCargoPorId = async (req, res) => {
  try {
    const cargo = await Cargo.findOne({ raw: true, where: { id_cargo: req.params.cargoId }, attributes: { exclude: ['id_cargo'] }, include: Area })
    res.status(200).json(cargo)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const actualizarCargoPorId = async (req, res) => {
  // Extraer la información del proyecto
  const { descripcion_cargo } = req.body
  try {
    // Revisar el ID
    let cargo = await Cargo.findByPk(req.params.cargoId)
    let isModified = false
    // Si el proyecto existe o no
    if (!cargo) {
      return res.status(404).json({ msg: 'Cargo no encontrado', type: 'error' })
    }
    if (descripcion_cargo && descripcion_cargo !== cargo.descripcion_cargo) {
      cargo.descripcion_cargo = descripcion_cargo
      isModified = true
    }
    let cargoActualizado
    if (isModified) {
      cargoActualizado = await cargo.save()
    } else {
      cargoActualizado = cargo
    }
    res.status(200).json(cargoActualizado)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const bajaCargoPorId = async (req, res) => {
  try {
    let cargo = await Cargo.findByPk(req.params.cargoId)

    if (!cargo) {
      return res.status(404).json({ msg: 'Cargo no encontrado', type: 'error' })
    }
    cargo.estado = 'I'
    const bajaCargo = await cargo.save()
    res.status(200).json(bajaCargo)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}