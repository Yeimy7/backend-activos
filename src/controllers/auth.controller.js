import User from '../models/User'
import Role from '../models/Role'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { WORD_SECRET } from '../config/config'
import { validationResult } from 'express-validator'

export const signin = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }

  const { email, password } = req.body
  try {
    // Revisar que sea un usuario registrado
    let usuario = await User.findOne({ where: { email }, include: Role })
    if (!usuario) {
      return res.status(400).json({ msg: 'El usuario no existe' })
    }

    // Revisar el password
    const passCorrecto = await bcryptjs.compare(password, usuario.password)
    if (!passCorrecto) {
      return res.status(400).json({ msg: 'Password incorrecto' })
    }
    console.log(usuario.rol.nombre_rol)

    // Token
    jwt.sign({ id: usuario.id_usuario }, WORD_SECRET, {
      expiresIn: 3600 //1 hora
    }, (error, token) => {
      if (error) throw error
      // Mensaje de confirmacion
      res.json({ token })
    })
  } catch (error) {
    console.log(error);
    res.status(400).send('Hubo un error')
  }
}
export const signup = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  try {
    //Guardar el usuario
    const rol = await Role.findOne({ where: { nombre_rol: 'Usuario' } })
    const newUser = req.body
    newUser.id_rol = rol.id_rol
    const registeredUser = await User.create(newUser)

    // Token
    jwt.sign({ id: registeredUser.id_usuario }, WORD_SECRET, {
      expiresIn: 3600 //1 hora
    }, (error, token) => {
      if (error) throw error
      // Mensaje de confirmacion
      res.json({ token })
    })
  } catch (error) {
    console.log(error);
    res.status(400).send('Hubo un error')
  }
}