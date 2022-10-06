import Auxiliar from '../models/Auxiliar'

export const obtenerAuxiliares = async (_req, res) => {
  try {
    const auxiliares = await Auxiliar.findAll()
    res.status(200).json(auxiliares)
  } catch (error) {
    res.status(500).send('Hubo un error')
  }
}