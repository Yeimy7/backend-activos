import User from '../models/User'

export const checkDuplicateUserNameOrEmail = async (req, res, next) => {
  const user = await User.findOne({ where: { ci: req.body.ci }, attributes: { exclude: ['password'] } })
  if (user) return res.status(400).json({ message: `El usuario con ci: ${req.body.ci} ya existe` })
  const userEmail = await User.findOne({ where: { email: req.body.email }, attributes: { exclude: ['password'] } })
  if (userEmail) return res.status(400).json({ message: 'El email ya existe' })
  next()
  
}