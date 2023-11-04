import Auxiliar from '../models/Auxiliar.js';
export const obtenerAuxiliares = async (_req, res) => {
  try {
    const auxiliares = await Auxiliar.findAll({
      order: [['descripcion_aux', 'ASC']]
    });
    res.status(200).json(auxiliares);
  } catch (error) {
    res.status(500).json({
      msg: 'Error en el servidor, intente nuevemente',
      type: 'error'
    });
  }
};