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
    await User.create(newUser)

    res.status(201).json({ id_persona: registeredPerson.id_persona, nombres, apellidos, ci, telefono, email, adicional: null, avatar: null, "rol.nombre_rol": "Usuario" })
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: 'Hubo un error al intentar registrar al usuario' })
  }
}
export const getUsers = async (_req, res) => {
  try {
    const users = await User.findAll({ raw: true, attributes: { exclude: ['password', 'id_rol'] }, include: Role })
    const allDataUsers = await Promise.all(users.map(async user => {
      const person = await Person.findOne({ raw: true, where: { id_persona: user.id_persona } })
      return await { ...person, ...user }

    }))
    res.json(allDataUsers)
  } catch (error) {
    res.status(500).json({ msg: 'Hubo un error al recuperar datos de los usuarios' })
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
    res.status(500).json({ msg: 'Error en el servidor' })
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
    res.status(500).json({ msg: 'Error en el servidor' })
  }
}

export const deleteUserById = async (req, res) => {
  try {
    let user = await User.findByPk(req.params.userId)

    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' })
    }

    await User.destroy({ where: { id_persona: req.params.userId } })
    res.json({ msg: 'usuario eliminado correctamente' })

  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error al intentar eliminar al usuario' })
  }
}