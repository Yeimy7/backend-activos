import { validationResult } from 'express-validator'
import Ambiente from '../models/Ambiente'

export const crearAmbiente = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    let err = errores.errors.map(mensaje => (mensaje.msg))
    return res.status(400).json({ msg: err.join(), type: 'error' })
  }
  try {
    const ambienteCreado = await Ambiente.create(req.body)
    res.status(201).json(ambienteCreado)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const obtenerAmbientes = async (_req, res) => {
  try {
    const ambientes = await Ambiente.findAll({ where: { estado: 'A' }, order: ['tipo_ambiente'] })
    res.status(200).json(ambientes)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}


export const obtenerAmbientePorId = async (req, res) => {
  try {
    const ambiente = await Ambiente.findOne({ where: { id_ambiente: req.params.ambienteId } })
    res.status(200).json(ambiente)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const actualizarAmbientePorId = async (req, res) => {
  // Extraer la información del proyecto
  const { codigo_ambiente, tipo_ambiente } = req.body
  try {
    // Revisar el ID
    let ambiente = await Ambiente.findByPk(req.params.ambienteId)
    let isModified = false
    // Si el ambiente existe o no
    if (!ambiente) {
      return res.status(404).json({ msg: 'Ambiente no encontrado', type: 'error' })
    }
    if (codigo_ambiente && codigo_ambiente !== ambiente.codigo_ambiente) {
      ambiente.codigo_ambiente = codigo_ambiente
      isModified = true
    }
    if (tipo_ambiente && tipo_ambiente !== ambiente.tipo_ambiente) {
      ambiente.tipo_ambiente = tipo_ambiente
      isModified = true
    }
    let ambienteActualizado
    if (isModified) {
      ambienteActualizado = await ambiente.save()
    } else {
      ambienteActualizado = ambiente
    }
    res.status(200).json(ambienteActualizado)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const bajaAmbientePorId = async (req, res) => {
  try {
    let ambiente = await Ambiente.findByPk(req.params.ambienteId)

    if (!ambiente) {
      return res.status(404).json({ msg: 'Ambiente no encontrado', type: 'error' })
    }
    ambiente.estado = 'I'
    const bajaAmbiente = await ambiente.save()
    res.status(200).json(bajaAmbiente)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })

  }
}

export const obtenerAmbientesPorPiso = async (req, res) => {
  try {
    const ambientes = await Ambiente.findAll({ where: { estado: 'A', id_piso: req.params.pisoId } })
    res.status(200).json(ambientes)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })

  }
}