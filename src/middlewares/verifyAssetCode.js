import Activo from '../models/Activo'

export const checkDuplicateAssetCode = async (req, res, next) => {
  const activo = await Activo.findOne({ where: { codigo_activo: req.body.codigo_activo } })
  if (activo) return res.status(400).json({ msg: `Ya existe un activo con código: ${req.body.codigo_activo}`, type:'error' })

  next()

}