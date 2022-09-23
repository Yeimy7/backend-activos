import jwt from 'jsonwebtoken'
import * as config from '../config/config'
import Role from '../models/Role'
import User from '../models/User'

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers['x-auth-token']
    if (!token) return res.status(403).json({ msg: 'No se proporciona ningún token' })
    const decoded = jwt.verify(token, config.WORD_SECRET)
    req.userId = decoded.id
    const user = await User.findOne({ where: { id_persona: req.userId }, attributes: { exclude: ['password'] } })
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' })
    next()
  } catch (error) {
    res.status(401).json({ msg: 'No esta autorizado' })
  }
}

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id_persona: req.userId }, attributes: { exclude: ['password'] } })
    const rol = await Role.findOne({
      where: { id_rol: user.id_rol },
    })
    if (rol.nombre_rol === 'Administrador') {
      next()
      return
    }
    return res.status(403).json({ msg: 'Requiere el rol de Admin' })
  } catch (error) {
    res.status(401).json({ msg: 'Error en el servidor' })
  }
}
export const isSuperAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id_persona: req.userId }, attributes: { exclude: ['password'] } })
    const rol = await Role.findOne({
      where: { id_rol: user.id_rol },
    })
    if (rol.nombre_rol === 'Super-admin') {
      next()
      return
    }
    return res.status(403).json({ msg: 'Requiere el rol de Super-admin' })
  } catch (error) {
    res.status(401).json({ msg: 'Error en el servidor' })
  }
}