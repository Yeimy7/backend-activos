import Activo from '../models/Activo'
import GrupoContable from '../models/GrupoContable'

export const obtenerGrupos = async (_req, res) => {
  try {
    const grupos = await GrupoContable.findAll()
    res.status(200).json(grupos)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const obtenerTotalPorGrupos = async (_req, res) => {
  try {
    const grupos = await GrupoContable.findAll({
      raw: true,
      attributes:
        [
          'id_grupo', 'descripcion_g'
        ]
    })
    const allDataGroups = await Promise.all(grupos.map(async grupo => {
      const total = await Activo.count({ where: { id_grupo: grupo.id_grupo, estado: 'A' } })
      return await { ...grupo, total }
    }))
    res.status(200).json(allDataGroups)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}