import Proveedor from '../models/Proveedor'
import { validationResult } from 'express-validator'

export const crearProveedor = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    const proveedorCreado = await Proveedor.create(req.body)
    res.status(201).json(proveedorCreado)
  } catch (error) {
    res.status(500).send('Hubo un error')
  }
}

export const obtenerProveedores = async (_req, res) => {
  try {
    const proveedores = await Proveedor.findAll()
    res.status(200).json(proveedores)
  } catch (error) {
    res.status(500).send('Hubo un error')
  }
}

export const obtenerProveedorPorId = async (req, res) => {
  try {
    const proveedor = await Proveedor.findOne({ where: { id_proveedor: req.params.proveedorId }, attributes: { exclude: ['id_proveedor'] } })
    res.status(200).json(proveedor)
  } catch (error) {
    res.status(500).send('Hubo un error')
  }
}

export const actualizarProveedorPorId = async (req, res) => {
  // Extraer la información del proyecto
  const { encargado, telefono } = req.body
  try {
    // Revisar el ID
    let proveedor = await Proveedor.findByPk(req.params.proveedorId)

    // Si el proyecto existe o no
    if (!proveedor) {
      return res.status(404).json({ msg: 'Proovedor no encontrado' })
    }
    if (encargado) {
      proveedor.encargado = encargado
    }
    if (telefono) {
      proveedor.telefono = telefono
    }
    const proveedorActualizado = await proveedor.save()
    res.status(200).json(proveedorActualizado)
  } catch (error) {
    res.status(500).send('Error en el servidor')
  }
}

export const bajaProveedorPorId = async (req, res) => {
  try {
    let proveedor = await Proveedor.findByPk(req.params.proveedorId)

    if (!proveedor) {
      return res.status(404).json({ msg: 'Proveedor no encontrado' })
    }
    proveedor.estado = 'I'
    const bajaProveedor = await proveedor.save()
    res.status(200).json(bajaProveedor)
  } catch (error) {
    console.log(error)
    res.status(500).send('Error en el servidor')
  }
}