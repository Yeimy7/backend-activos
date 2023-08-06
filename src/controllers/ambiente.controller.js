import Ambiente from '../models/Ambiente'
import { validationResult } from 'express-validator'

export const crearAmbiente = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    const ambienteCreado = await Ambiente.create(req.body)
    res.status(201).json(ambienteCreado)
  } catch (error) {
    res.status(500).send('Hubo un error')
  }
}

export const obtenerAmbientes = async (_req, res) => {
  try {
    const ambientes = await Ambiente.findAll()
    res.status(200).json(ambientes)
  } catch (error) {
    res.status(500).send('Hubo un error')
  }
}


export const obtenerAmbientePorId = async (req, res) => {
  try {
    const ambiente = await Ambiente.findOne({ where: { id_ambiente: req.params.ambienteId } })
    res.status(200).json(ambiente)
  } catch (error) {
    res.status(500).send('Hubo un error')
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
      return res.status(404).json({ msg: 'Ambiente no encontrado' })
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
    res.status(500).send('Error en el servidor')
  }
}

export const bajaAmbientePorId = async (req, res) => {
  try {
    let ambiente = await Ambiente.findByPk(req.params.ambienteId)

    if (!ambiente) {
      return res.status(404).json({ msg: 'Ambiente no encontrado' })
    }
    ambiente.estado = 'I'
    const bajaAmbiente = await ambiente.save()
    res.status(200).json(bajaAmbiente)
  } catch (error) {
    console.log(error)
    res.status(500).send('Error en el servidor')
  }
}

export const obtenerAmbientesPorPiso = async (req, res) => {
  try {
    const ambientes = await Ambiente.findAll({ where: { estado: 'A', id_piso: req.params.pisoId } })
    res.status(200).json(ambientes)
  } catch (error) {
    res.status(500).send('Hubo un error')
  }
}