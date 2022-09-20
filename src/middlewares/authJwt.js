import jwt from 'jsonwebtoken'
import * as config from '../config/config'
import Role from '../models/Role'
import User from '../models/User'

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers['x-auth-token']
    if (!token) return res.status(403).json({ message: "No token provided" })
    const decoded = jwt.verify(token, config.WORD_SECRET)
    req.userId = decoded.id
    const user = await User.findOne({ where: { id_usuario: req.userId }, attributes: { exclude: ['password'] } })
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
    next()
  } catch (error) {
    res.status(401).json({ msg: 'Unauthorized' })
  }
}

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id_usuario: req.userId }, attributes: { exclude: ['password'] } })
    const rol = await Role.findOne({
      where: { id_rol: user.id_rol },
    })
    if (rol.nombre_rol === 'Administrador') {
      next()
      return
    }
    return res.status(403).json({ mesage: 'Requiere el rol de Admin' })
  } catch (error) {
    res.status(401).json({ msg: 'Hubo un error' })
  }
}
export const isSuperAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id_usuario: req.userId }, attributes: { exclude: ['password'] } })
    const rol = await Role.findOne({
      where: { id_rol: user.id_rol },
    })
    if (rol.nombre_rol === 'Super-admin') {
      next()
      return
    }
    return res.status(403).json({ mesage: 'Requiere el rol de Super-admin' })
  } catch (error) {
    res.status(401).json({ msg: 'Hubo un error' })
  }
}