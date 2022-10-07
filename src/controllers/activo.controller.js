import Activo from '../models/Activo'
import { validationResult } from 'express-validator'
import Ambiente from '../models/Ambiente'
import Auxiliar from '../models/Auxiliar'
import GrupoContable from '../models/GrupoContable'
import Proveedor from '../models/Proveedor'

import path from 'path'
import fs from 'fs-extra'
import Empleado from '../models/Empleado'
import Person from '../models/Person'
import { Op } from 'sequelize'

export const crearActivo = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  const { codigo_activo, fecha_ingreso, descripcion_activo, costo, img_activo, codigo_ambiente, descripcion_aux, descripcion_g, razon_social } = req.body
  try {
    const ambiente = await Ambiente.findOne({ where: { codigo_ambiente: codigo_ambiente } })
    if (!ambiente) return res.status(404).json({ msg: 'Ambiente no encontrado' })

    const auxiliar = await Auxiliar.findOne({ where: { descripcion_aux: descripcion_aux } })
    if (!auxiliar) return res.status(404).json({ msg: 'Auxiliar no encontrado' })

    const grupo = await GrupoContable.findOne({ where: { descripcion_g: descripcion_g } })
    if (!grupo) return res.status(404).json({ msg: 'Grupo contable no encontrado' })

    const proveedor = await Proveedor.findOne({ where: { razon_social: razon_social } })
    if (!proveedor) return res.status(404).json({ msg: 'Proveedor no encontrado' })

    const newActivo = {
      codigo_activo,
      fecha_ingreso,
      descripcion_activo,
      costo,
      img_activo,
      id_ambiente: ambiente.id_ambiente,
      id_auxiliar: auxiliar.id_auxiliar,
      id_grupo: grupo.id_grupo,
      id_proveedor: proveedor.id_proveedor
    }
    const activoCreado = await Activo.create(newActivo)

    res.status(201).json({
      ...activoCreado.dataValues,
      'ambiente.codigo_ambiente': ambiente.codigo_ambiente,
      'ambiente.tipo_ambiente': ambiente.tipo_ambiente,
      'auxiliar.descripcion_aux': auxiliar.descripcion_aux,
      'grupo_contable.descripcion_g': grupo.descripcion_g,
      'proveedor.razon_social': proveedor.razon_social
    })
  } catch (error) {
    console.log('---->', error)
    res.status(500).send('Hubo un error')
  }
}

export const obtenerActivos = async (_req, res) => {
  try {
    const activos = await Activo.findAll({
      raw: true, where: { estado: 'A' }, include:
        [
          {
            model: Ambiente,
            attributes: ['codigo_ambiente', 'tipo_ambiente']
          },
          {
            model: Auxiliar,
            attributes: ['descripcion_aux']
          },
          {
            model: GrupoContable,
            attributes: ['descripcion_g']
          },
          {
            model: Proveedor,
            attributes: ['razon_social']
          }
        ]
    })
    res.status(200).json(activos)
  } catch (error) {
    console.log(error)
    res.status(500).send('Hubo un error')
  }
}

export const obtenerActivoPorId = async (req, res) => {
  try {
    const activo = await Activo.findOne({
      raw: true, where: { id_activo: req.params.activoId }, attributes: { exclude: ['id_activo'] }, include: [
        {
          model: Ambiente,
          attributes: ['codigo_ambiente', 'tipo_ambiente']
        },
        {
          model: Auxiliar,
          attributes: ['descripcion_aux']
        },
        {
          model: GrupoContable,
          attributes: ['descripcion_g']
        },
        {
          model: Proveedor,
          attributes: ['razon_social']
        }
      ]
    })
    res.status(200).json(activo)
  } catch (error) {
    console.log('---->', error)
    res.status(500).send('Hubo un error')
  }
}

export const actualizarActivoPorId = async (req, res) => {
  // Extraer la información del proyecto
  const { fecha_ingreso, descripcion_activo } = req.body
  try {
    // Revisar el ID
    let activo = await Activo.findByPk(req.params.activoId)
    let isModified = false
    // Si el proyecto existe o no
    if (!activo) {
      return res.status(404).json({ msg: 'Activo no encontrado' })
    }
    if (fecha_ingreso && fecha_ingreso !== activo.fecha_ingreso) {
      activo.fecha_ingreso = fecha_ingreso
      isModified = true
    }
    if (descripcion_activo && descripcion_activo !== activo.descripcion_activo) {
      activo.descripcion_activo = descripcion_activo
      isModified = true
    }
    let activoActualizado
    if (isModified) {
      activoActualizado = await activo.save()
    } else {
      activoActualizado = activo
    }
    res.status(200).json(activoActualizado)
  } catch (error) {
    res.status(500).send('Error en el servidor')
  }
}

export const bajaActivoPorId = async (req, res) => {
  try {
    let activo = await Activo.findByPk(req.params.activoId)

    if (!activo) {
      return res.status(404).json({ msg: 'Activo no encontrado' })
    }
    activo.estado = 'I'
    const bajaActivo = await activo.save()
    res.status(200).json(bajaActivo)
  } catch (error) {
    console.log(error)
    res.status(500).send('Error en el servidor')
  }
}

export const actualizarImagenActivoPorId = async (req, res) => {

  try {
    // Revisar el ID
    let activo = await Activo.findByPk(req.params.activoId)
    if (!activo) {
      return res.status(400).json({ msg: 'El activo no existe' })
    }

    if (activo.img_activo) {
      await fs.unlink(path.resolve(activo.img_activo))
    }
    console.log(req.file)
    activo.img_activo = req.file.path
    const result = await activo.save()
    res.status(200).json(result)
  } catch (error) {
    console.log('-------> ', error);
    res.status(500).json({ msg: 'Error en el servidor' })
  }
}

export const asignarActivo = async (req, res) => {
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  const { id_activo, id_persona } = req.body
  try {
    // Revisar el ID
    let activo = await Activo.findByPk(id_activo)
    if (!activo) {
      return res.status(404).json({ msg: 'Activo no encontrado' })
    }
    let empleado = await Empleado.findByPk(id_persona)
    if (!empleado) {
      return res.status(404).json({ msg: 'Empleado no encontrado' })
    }
    const date = new Date()
    const today = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

    activo.fecha_asig_empleado = today
    activo.id_persona = empleado.id_persona

    const activoAsignado = await activo.save()

    res.status(200).json(activoAsignado)
  } catch (error) {
    res.status(500).send('Error en el servidor')
  }
}

export const activosAsignados = async (req, res) => {
  try {
    const activos = await Activo.findAll({
      raw: true, where: {
        estado: 'A', [Op.and]: [
          { id_persona: { [Op.not]: null } },
          { id_persona: { [Op.not]: '' } }
        ]
      }
    })
    const allDataActivos = await Promise.all(activos.map(async activo => {
      const person = await Person.findOne({ raw: true, where: { id_persona: activo.id_persona } })
      return await { ...person, ...activo }
    }))
    res.status(200).json(allDataActivos)
  } catch (error) {
    console.log(error)
    res.status(500).send('Hubo un error')
  }
}
export const activosNoAsignados = async (req, res) => {
  try {
    const activos = await Activo.findAll({
      raw: true, where: {
        estado: 'A', [Op.or]: [
          { id_persona: { [Op.eq]: null } },
          { id_persona: { [Op.eq]: '' } }
        ]
      }
    })
    res.status(200).json(activos)
  } catch (error) {
    console.log(error)
    res.status(500).send('Hubo un error')
  }
}

export const desvincularActivo = async (req, res) => {
  const { id_activo } = req.body
  try {
    // Revisar el ID
    let activo = await Activo.findByPk(id_activo)
    if (!activo) {
      return res.status(404).json({ msg: 'Activo no encontrado' })
    }

    activo.fecha_asig_empleado = null
    activo.id_persona = null

    const activoAsignado = await activo.save()

    res.status(200).json(activoAsignado)
  } catch (error) {
    res.status(500).send('Error en el servidor')
  }
}