import Person from '../models/Person'
import User from '../models/User'

export const checkDuplicateUserNameOrEmail = async (req, res, next) => {
  const person=await Person.findOne({where: { ci: req.body.ci  }})
  if (person) return res.status(400).json({ message: `El usuario con ci: ${req.body.ci} ya existe` })
  
  const userEmail = await User.findOne({ where: { email: req.body.email }, attributes: { exclude: ['password'] } })
  if (userEmail) return res.status(400).json({ message: 'El email ya existe' })
  next()
  
}