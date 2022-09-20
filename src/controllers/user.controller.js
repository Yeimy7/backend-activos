import Person from '../models/Person'
import User from '../models/User'
import Role from '../models/Role'
// import jwt from 'jsonwebtoken'
// import { WORD_SECRET } from '../config/config'
import { validationResult } from 'express-validator'

export const createUser = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  const { ci, nombres, apellidos, telefono, email, password, adicional, avatar } = req.body
  try {
    //Guardar datos de Persona
    const registeredPerson = await Person.create({ ci, nombres, apellidos, telefono })

    //Guardar el usuario
    const rol = await Role.findOne({ where: { nombre_rol: 'Usuario' } })
    const newUser = {
      id_persona: registeredPerson.id_persona,
      email, password, adicional, avatar, id_rol: rol.id_rol,
    }
    // newUser.id_rol = rol.id_rol
    const registeredUser = await User.create(newUser)

    // // Token
    // jwt.sign({ id: registeredUser.id_usuario }, WORD_SECRET, {
    //   expiresIn: 3600 //1 hora
    // }, (error, token) => {
    //   if (error) throw error
    //   // Mensaje de confirmacion
    //   res.json({ token })
    // })
    res.status(201).json({ msg: 'Usuario creado exitosamente' })
  } catch (error) {
    console.log(error);
    res.status(400).send('Hubo un error')
  }
}

export const promoteUser = async (req, res) => {
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }

  try {
    const user = await User.findOne({ where: { id_persona: req.params.id } })
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' })

    // Buscar el rol Administrador
    const rol = await Role.findOne({ where: { nombre_rol: 'Administrador' } })
    user.id_rol = rol.id_rol
    // newUser.id_rol = rol.id_rol
    // console.log(user)
    await user.save()
    res.status(201).json({ msg: 'Rol modificado a Administrador' })

  } catch (error) {
    console.log(error);
    res.status(500).send('Error en el servidor')
  }
}
export const descendUser = async (req, res) => {
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }

  try {
    const user = await User.findOne({ where: { id_persona: req.params.id } })
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' })

    // Buscar el rol Administrador
    const rol = await Role.findOne({ where: { nombre_rol: 'Usuario' } })
    user.id_rol = rol.id_rol
    // newUser.id_rol = rol.id_rol
    // console.log(user)
    await user.save()
    res.status(201).json({ msg: 'Rol modificado a Usuario' })

  } catch (error) {
    console.log(error);
    res.status(500).send('Error en el servidor')
  }
} 