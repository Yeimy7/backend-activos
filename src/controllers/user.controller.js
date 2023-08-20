import { validationResult } from 'express-validator'
import Person from '../models/Person'
import Role from '../models/Role'
import User from '../models/User'

export const createUser = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    let err = x.errores.errors.map(mensaje => (mensaje.msg))
    return res.status(400).json({ msg: err.join(), type: 'error' })
  }
  const { ci, nombres, apellidos, telefono, email, password, adicional, avatar } = req.body
  try {
    //Guardar datos de Persona
    const registeredPerson = await Person.create({ ci, nombres, apellidos, telefono })

    //Guardar el usuario
    const rol = await Role.findOne({ where: { nombre_rol: 'Custodio' } })
    const newUser = {
      id_persona: registeredPerson.id_persona,
      email, password, adicional, avatar, id_rol: rol.id_rol,
    }
    // newUser.id_rol = rol.id_rol
    await User.create(newUser)

    res.status(201).json({ id_persona: registeredPerson.id_persona, nombres, apellidos, ci, telefono, email, adicional: null, avatar: null, "rol.nombre_rol": "Custodio" })
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}
export const getUsers = async (_req, res) => {
  try {
    const users = await User.findAll({ raw: true, attributes: { exclude: ['password', 'id_rol'] }, include: Role,  where: { estado: 'A' } })
    const allDataUsers = await Promise.all(users.map(async user => {
      const person = await Person.findOne({ raw: true, where: { id_persona: user.id_persona } })
      return await { ...person, ...user }

    }))
    res.json(allDataUsers)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}
export const ascendUser = async (req, res) => {
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }

  try {
    const user = await User.findOne({ where: { id_persona: req.params.id } })
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado', type: 'error' })

    // Buscar el rol Administrador
    const rol = await Role.findOne({ where: { nombre_rol: 'Administrador' } })
    user.id_rol = rol.id_rol
    // newUser.id_rol = rol.id_rol
    // console.log(user)
    await user.save()
    res.status(201).json({ msg: 'Rol modificado a Administrador', type: 'success' })

  } catch (error) {
    res.status(500).json({ msg: 'Hubo un error al recuperar datos de los usuarios' })
  }
}
export const descendUser = async (req, res) => {
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }

  try {
    const user = await User.findOne({ where: { id_persona: req.params.id } })
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado', type: 'error' })

    // Buscar el rol Administrador
    const rol = await Role.findOne({ where: { nombre_rol: 'Custodio' } })
    user.id_rol = rol.id_rol
    // newUser.id_rol = rol.id_rol
    // console.log(user)
    await user.save()
    res.status(201).json({ msg: 'Rol modificado a Custodio', type: 'success' })

  } catch (error) {
    res.status(500).json({ msg: 'Hubo un error al recuperar datos de los usuarios' })
  }
}

export const deleteUserById = async (req, res) => {
  try {
    let user = await User.findByPk(req.params.userId)

    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado', type: 'error' })
    }
    user.estado = 'I'
    await user.save()
    res.json({ msg: 'Usuario eliminado correctamente', type: 'success' })

  } catch (error) {
    res.status(500).json({ msg: 'Hubo un error al recuperar datos de los usuarios' })
  }
}