import { validationResult } from 'express-validator'
import Proveedor from '../models/Proveedor.js'

export const crearProveedor = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    let err = errores.errors.map(mensaje => (mensaje.msg))
    return res.status(400).json({ msg: err.join(), type: 'error' })
  }
  try {
    const proveedorCreado = await Proveedor.create(req.body)
    res.status(201).json(proveedorCreado)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const obtenerProveedores = async (_req, res) => {
  try {
    const proveedores = await Proveedor.findAll({ where: { estado: 'A' } })
    res.status(200).json(proveedores)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const obtenerProveedorPorId = async (req, res) => {
  try {
    const proveedor = await Proveedor.findOne({ where: { id_proveedor: req.params.proveedorId }, attributes: { exclude: ['id_proveedor'] } })
    res.status(200).json(proveedor)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const actualizarProveedorPorId = async (req, res) => {
  // Extraer la información del proyecto
  const { encargado, telefono } = req.body
  try {
    // Revisar el ID
    let proveedor = await Proveedor.findByPk(req.params.proveedorId)
    let isModified = false
    // Si el proyecto existe o no
    if (!proveedor) {
      return res.status(404).json({ msg: 'Proovedor no encontrado', type: 'error' })
    }
    if (encargado && encargado !== proveedor.encargado) {
      proveedor.encargado = encargado
      isModified = true
    }
    if (telefono && telefono !== proveedor.telefono) {
      proveedor.telefono = telefono
      isModified = true
    }
    let proveedorActualizado
    if (isModified) {
      proveedorActualizado = await proveedor.save()
    } else {
      proveedorActualizado = proveedor
    }
    res.status(200).json(proveedorActualizado)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const bajaProveedorPorId = async (req, res) => {
  try {
    let proveedor = await Proveedor.findByPk(req.params.proveedorId)

    if (!proveedor) {
      return res.status(404).json({ msg: 'Proveedor no encontrado', type: 'error' })
    }
    proveedor.estado = 'I'
    const bajaProveedor = await proveedor.save()
    res.status(200).json(bajaProveedor)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}