import { validationResult } from 'express-validator'
import Area from '../models/Area'
import Cargo from '../models/Cargo'
import Empleado from '../models/Empleado'
import Person from '../models/Person'

export const crearEmpleado = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    let err = x.errores.errors.map(mensaje => (mensaje.msg))
    return res.status(400).json({ msg: err.join(), type: 'error' })
  }
  const { ci, nombres, apellidos, fecha_incorporacion, descripcion_cargo } = req.body
  try {
    //Guardar datos de Persona
    const personaRegistrada = await Person.findOne({ raw: true, where: { ci: ci } })
    let idPersona = ''
    if (personaRegistrada) {
      idPersona = personaRegistrada.id_persona
    } else {
      const registeredPerson = await Person.create({ ci, nombres, apellidos })
      idPersona = registeredPerson.id_persona
    }

    //Guardar el usuario
    const cargo = await Cargo.findOne({ raw: true, where: { descripcion_cargo: descripcion_cargo }, include: Area })
    const newEmpleado = {
      id_persona: idPersona,
      fecha_incorporacion,
      id_cargo: cargo.id_cargo,
    }
    await Empleado.create(newEmpleado)

    res.status(201).json({ id_persona: idPersona, nombres, apellidos, ci, fecha_incorporacion, "cargo.descripcion_cargo": descripcion_cargo, "cargo.area.nombre_area": cargo['area.nombre_area'] })
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}
export const obtenerEmpleados = async (_req, res) => {
  try {
    const empleados = await Empleado.findAll({ raw: true, where: { estado: 'A' }, attributes: { exclude: ['id_cargo'] }, include: { model: Cargo, include: { model: Area } } })
    const datosEmpleados = await Promise.all(empleados.map(async empleado => {
      const persona = await Person.findOne({ raw: true, where: { id_persona: empleado.id_persona } })
      return await { ...persona, ...empleado }

    }))
    res.status(200).json(datosEmpleados)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const obtenerEmpleadoPorId = async (req, res) => {
  try {
    const persona = await Person.findOne({ raw: true, where: { id_persona: req.params.empleadoId } })
    const empleado = await Empleado.findOne({ raw: true, where: { id_persona: persona.id_persona }, attributes: { exclude: ['id_cargo'] }, include: { model: Cargo, include: { model: Area } } })
    const datosEmpleado = await { ...persona, ...empleado }
    res.status(200).json(datosEmpleado)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const actualizarEmpleadoPorId = async (req, res) => {
  // Extraer la información del proyecto
  const { fecha_incorporacion, descripcion_cargo } = req.body
  try {
    // Revisar el ID
    const empleado = await Empleado.findByPk(req.params.empleadoId, { include: { model: Cargo, include: { model: Area } } })
    let isModified = false
    // Si el proyecto existe o no
    if (!empleado) {
      return res.status(404).json({ msg: 'Empleado no encontrado', type: 'error' })
    }

    if (fecha_incorporacion && fecha_incorporacion !== empleado.fecha_incorporacion) {
      empleado.fecha_incorporacion = fecha_incorporacion
      isModified = true
    }
    // TENDREMOS QUE VERIFICAR SI EXISTEN ACTIVOS ASIGNADOS A ESTE EMPLEADO, 
    // DE NO SER ASI:
    if (descripcion_cargo && descripcion_cargo !== empleado.cargo.descripcion_cargo) {
      const cargo = await Cargo.findOne({ where: { descripcion_cargo: descripcion_cargo } })
      empleado.id_cargo = cargo.id_cargo
      isModified = true
    }
    let empleadoActualizado
    if (isModified) {
      const newEmpleado = await empleado.save()
      empleadoActualizado = await Empleado.findOne({ raw: true, where: { id_persona: newEmpleado.id_persona }, attributes: { exclude: ['id_cargo'] }, include: { model: Cargo, include: { model: Area } } })
    } else {
      empleadoActualizado = empleado
    }
    res.status(200).json(empleadoActualizado)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const bajaEmpleadoPorId = async (req, res) => {
  try {
    const empleado = await Empleado.findByPk(req.params.empleadoId)

    if (!empleado) {
      return res.status(404).json({ msg: 'Empleado no encontrado', type: 'error' })
    }
    empleado.estado = 'I'
    const bajaEmpleado = await empleado.save()
    res.status(200).json(bajaEmpleado)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}
export const totalEmpleados = async (_req, res) => {
  try {
    const totalEmpleados = await Empleado.count({
      where: { estado: 'A' }
    });
    res.status(200).json(totalEmpleados)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}