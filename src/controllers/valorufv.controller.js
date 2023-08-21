import { Sequelize } from 'sequelize'
import { validationResult } from 'express-validator'
import ValorUfv from '../models/ValorUfv'

export const crearValorUfv = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    let err = errores.errors.map(mensaje => (mensaje.msg))
    return res.status(400).json({ msg: err.join(), type: 'error' })
  }
  const { gestion, valor } = req.body;
  try {

    //Guardar el datos 
    const resultado = await ValorUfv.create({ gestion, valor })

    res.status(201).json(resultado)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}
export const obtenerValoresUfv = async (_req, res) => {
  try {
    const valoresUfv = await ValorUfv.findAll()
    res.status(200).json(valoresUfv)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const obtenerValorUfvPorId = async (req, res) => {
  try {
    const valorUfv = await ValorUfv.findOne({
      raw: true, where: { id_valor_ufv: req.params.valorUfvId }
    })
    res.status(200).json(valorUfv)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const obtenerValorUfvPorGestion = async (req, res) => {
  const { gestion } = req.body;
  try {

    const valorUfv = await ValorUfv.findAll({
      raw: true, where: { gestion: gestion }
    })
    res.status(200).json(valorUfv)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const obtenerUltimaGestion = async (_req, res) => {
  try {
    const valorUfv = await ValorUfv.findAll({
      attributes: [Sequelize.fn('max', Sequelize.col('gestion'))],
      raw: true,
    })
    res.status(200).json(valorUfv[0])
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const obtenerGestiones = async (_req, res) => {
  try {
    const gestiones = await ValorUfv.findAll({
      raw: true, attributes: ['gestion'], order: ['gestion']
    })
    res.status(200).json(gestiones)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}