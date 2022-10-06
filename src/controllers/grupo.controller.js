import GrupoContable from '../models/GrupoContable'

export const obtenerGrupos = async (_req, res) => {
  try {
    const grupos = await GrupoContable.findAll()
    res.status(200).json(grupos)
  } catch (error) {
    res.status(500).send('Hubo un error')
  }
}