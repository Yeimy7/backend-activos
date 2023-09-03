import Person from '../models/Person.js'
import User from '../models/User.js'

export const checkDuplicateUserNameOrEmail = async (req, res, next) => {
  const person = await Person.findOne({ where: { ci: req.body.ci } })
  if (person) return res.status(400).json({ msg: `El usuario con ci: ${req.body.ci} ya existe`, type: 'error' })

  const userEmail = await User.findOne({ where: { email: req.body.email }, attributes: { exclude: ['password'] } })
  if (userEmail) return res.status(400).json({ msg: 'El email ya existe', type: 'error' })
  next()

}