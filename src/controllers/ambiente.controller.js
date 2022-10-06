import Ambiente from '../models/Ambiente'

export const obtenerAmbientes = async (_req, res) => {
  try {
    const ambientes = await Ambiente.findAll()
    res.status(200).json(ambientes)
  } catch (error) {
    res.status(500).send('Hubo un error')
  }
}