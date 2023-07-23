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
import { crearPDF } from '../utils/generarPDF'
import { calculoDepreciacionActivoMes } from '../utils/calculoDepreciacion'
import Cargo from '../models/Cargo'
import Piso from '../models/Piso'
import Edificio from '../models/Edificio'
import Area from '../models/Area'
import { depreciacion } from '../utils/cuadroDepreciacion'

export const crearActivo = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  const { codigo_activo, fecha_ingreso, descripcion_activo, costo, dep_acumulada, valor_residual, indice_ufv, img_activo, codigo_ambiente, descripcion_aux, descripcion_g, razon_social } = req.body
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
      dep_acumulada,
      valor_residual,
      indice_ufv,
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
            attributes: ['descripcion_g', 'coeficiente', 'vida_util']
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

export const obtenerActivoPorCodigo = async (req, res) => {
  try {
    let activo = await Activo.findOne({
      raw: true, where: { codigo_activo: req.params.codigoActivo }, attributes:
        [
          'codigo_activo', 'fecha_ingreso', 'descripcion_activo', 'img_activo', 'estado'
        ]
      , include: [
        {
          model: Ambiente,
          attributes: ['codigo_ambiente', 'tipo_ambiente'],
          include: [
            {
              model: Piso,
              attributes: ['codigo_piso'],
              include: [
                {
                  model: Edificio,
                  attributes: ['nombre_edificio']
                },
              ]
            },
          ]
        },
        {
          model: Auxiliar,
          attributes: ['descripcion_aux']
        },
        {
          model: Proveedor,
          attributes: ['razon_social']
        },
        {
          model: Empleado,
          attributes: ['id_persona'],
          include: [
            {
              model: Cargo,
              attributes: ['descripcion_cargo'],
              include: [
                {
                  model: Area,
                  attributes: ['nombre_area', 'codigo_area']
                },
              ]
            },
          ]
        }
      ]
    })
    if (activo) {
      let datosPersona = null
      if (activo['empleado.id_persona']) {
        const persona = await Person.findByPk(activo['empleado.id_persona'])
        datosPersona = `${persona.nombres} ${persona.apellidos}`
      }
      activo = { ...activo, empleado: datosPersona }
    }

    res.status(200).json(activo)
  } catch (error) {
    console.log('---->', error)
    res.status(500).send('Hubo un error')
  }
}

export const actualizarActivoPorId = async (req, res) => {
  // Extraer la información del proyecto
  const { fecha_ingreso, codigo_activo, descripcion_activo } = req.body
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
    if (codigo_activo && codigo_activo !== activo.codigo_activo) {
      activo.codigo_activo = codigo_activo
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

    activo.fecha_asig_empleado = date
    activo.id_persona = empleado.id_persona

    const activoAsignado = await activo.save({ raw: true })
    const person = await Person.findOne({ raw: true, where: { id_persona: id_persona } })

    res.status(200).json(
      {
        ...activoAsignado.dataValues,
        ...person
      }
    )
  } catch (error) {
    console.log('------>', error)
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
    console.log('-------->', error)
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

export const trasladarActivo = async (req, res) => {
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  const { id_activo, id_ambiente } = req.body
  try {
    // Revisar el ID
    let activo = await Activo.findByPk(id_activo)
    if (!activo) {
      return res.status(404).json({ msg: 'Activo no encontrado' })
    }
    let ambiente = await Ambiente.findByPk(id_ambiente)
    if (!ambiente) {
      return res.status(404).json({ msg: 'Ambiente no encontrado' })
    }
    const date = new Date()

    activo.fecha_asig_ambiente = date
    activo.id_ambiente = ambiente.id_ambiente

    const activoTrasladado = await activo.save()

    res.status(200).json(
      {
        ...activoTrasladado.dataValues,
        ...ambiente.dataValues
      }
    )
  } catch (error) {
    console.log('------>', error)
    res.status(500).send('Error en el servidor')
  }
}

export const actaActivos = async (_req, res) => {
  try {
    const activos = await Activo.findAll({
      raw: true, where: { estado: 'A' }, include:
        [
          {
            model: Ambiente,
            attributes: ['codigo_ambiente', 'tipo_ambiente']
          }
        ]
    })
    const itemsActivos = activos.map(activo => {
      return {
        ...activo,
        codigo_ambiente: activo['ambiente.codigo_ambiente'],
        tipo_ambiente: activo['ambiente.tipo_ambiente'],
      }
    })
    const pdf = await crearPDF('listaActivos', itemsActivos)
    res.contentType('application/pdf');
    res.status(200).send(pdf)
  } catch (error) {
    console.log(error)
    res.status(500).send('Hubo un error')
  }
}

export const actaDepreciacionActivos = async (req, res) => {
  const { mes, anio } = req.body
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
            attributes: ['descripcion_g', 'vida_util', 'coeficiente']
          }
        ]
    })

    const itemsActivos = (activos.map(activo => {
      const valor_actual = calculoDepreciacionActivoMes(
        {
          costo: activo.costo,
          coeficiente: activo['grupo_contable.coeficiente'],
          vida_util: activo['grupo_contable.vida_util'],
          fecha_ingreso: activo.fecha_ingreso,
          mes: mes,
          anio: anio
        })
      return {
        ...activo,
        grupo_contable: activo['grupo_contable.descripcion_g'],
        valor_actual: valor_actual
      }
    }))
    const pdf = await crearPDF('depreciacionActivos', itemsActivos)
    res.contentType('application/pdf');
    res.status(200).send(pdf)

  } catch (error) {
    console.log(error)
    res.status(500).send('Hubo un error')
  }
}
// ******************************************************
export const cuadroDepreciacionActivos = async (req, res) => {
  const { idGrupo, indice_actual, mes_actual, anio_actual } = req.body
  try {
    const activos = await Activo.findAll({
      raw: true, where: {
        estado: 'A',
        id_grupo: idGrupo,
        [Op.and]: [
          { id_grupo: { [Op.not]: null } },
          { id_grupo: { [Op.not]: '' } }
        ],
      },
      include:
        [
          {
            model: Auxiliar,
            attributes: ['descripcion_aux']
          },
          {
            model: GrupoContable,
            attributes: ['descripcion_g', 'vida_util', 'coeficiente']
          },
          {
            model: Proveedor,
            attributes: ['razon_social']
          },

        ]
    })

    const itemsActivos = await Promise.all(activos.map(async activo => {
      const { fecha_ingreso: fi, valor_residual: vr, indice_ufv: iu, costo } = activo
      const valores = await depreciacion(fi, mes_actual, anio_actual, activo['grupo_contable.vida_util'], costo, vr, iu, indice_actual)
      const { B, F, G, H, I, J, K, L } = valores;
      return await {
        // ...activo,
        codigo: activo.codigo_activo,
        grupo_contable: activo['grupo_contable.descripcion_g'],
        auxiliar: activo['auxiliar.descripcion_aux'],
        vida_util: activo['grupo_contable.vida_util'],
        descripcion: activo.descripcion_activo,
        A: activo.fecha_ingreso,
        C: iu,
        D: activo.costo,
        E: activo.valor_residual,
        B: Number(B), F, G, H, I, J, K, L
      }
    }))

    // console.log(itemsActivos)
    // res.status(201);
    const pdf = await crearPDF('cuadroDepreciacion',
      {
        grupo_contable: itemsActivos[0].grupo_contable,
        vida_util: itemsActivos[0].vida_util * 12,
        ufv_actual: indice_actual,
        data: itemsActivos
      })
    res.contentType('application/pdf');
    res.status(200).send(pdf)

  } catch (error) {
    console.log(error)
    res.status(500).send('Hubo un error')
  }
}
// ******************************************************************
export const depreciarActivos = async (req, res) => {
  const { indice_actual, anio_actual } = req.body
  if (!indice_actual) {
    res.status(500).send('NO existe el indice actual')
    return
  }
  try {
    const activos = await Activo.findAll({
      raw: true, where: { estado: 'A' }, include:
        [
          {
            model: GrupoContable,
            attributes: ['descripcion_g', 'vida_util', 'coeficiente']
          }
        ]
    })

    const mes_actual = 12

    const itemsActivos = await Promise.all(activos.map(async activo => {
      const { fecha_ingreso: fi, valor_residual: vr, indice_ufv: iu, costo } = activo
      const valores = await depreciacion(fi, mes_actual,anio_actual, activo['grupo_contable.vida_util'], costo, vr, iu, indice_actual)
      const { B, F, G, H, I, J, K, L } = valores;
      let act = await Activo.findByPk(activo.id_activo)
      act.valor_residual = G;
      await act.save();
      return await {
        // ...activo,
        codigo: activo.codigo_activo,
        grupo_contable: activo['grupo_contable.descripcion_g'],
        auxiliar: activo['auxiliar.descripcion_aux'],
        vida_util: activo['grupo_contable.vida_util'],
        descripcion: activo.descripcion_activo,
        A: activo.fecha_ingreso,
        C: iu,
        D: activo.costo,
        E: activo.valor_residual,
        B: Number(B), F, G, H, I, J, K, L
      }
    }))

    // console.log(itemsActivos)
    // res.status(201);
    const pdf = await crearPDF('cuadroDepreciacion',
      {
        grupo_contable: itemsActivos[0].grupo_contable,
        vida_util: itemsActivos[0].vida_util * 12,
        ufv_actual: indice_actual,
        data: itemsActivos
      })
    res.contentType('application/pdf');
    res.status(200).send(pdf)

  } catch (error) {
    console.log(error)
    res.status(500).send('Hubo un error')
  }
}
// ****************************************************

export const actaAsignacionActivo = async (req, res) => {
  //Buscar cargo jefe de unidad de activos fijos 
  const { id_activo } = req.body
  try {
    const activo = await Activo.findOne({
      raw: true, where: { id_activo }, include:
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
            attributes: ['descripcion_g', 'vida_util', 'coeficiente']
          },
          {
            model: Empleado,
            attributes: ['id_persona', 'id_cargo'],
            include: {
              model: Cargo,
              attributes: ['descripcion_cargo']
            }
          }
        ]
    })
    const persona = await Person.findOne({ raw: true, where: { id_persona: activo['empleado.id_persona'] } })
    const cargo = await Cargo.findOne({ raw: true, where: { descripcion_cargo: 'Jefe de unidad de activos fijos' } })
    const encargado = await Empleado.findOne({ raw: true, where: { id_cargo: cargo.id_cargo } })
    const personaEncargado = await Person.findOne({ raw: true, where: { id_persona: encargado.id_persona } })
    const datosActivo = {
      oficina: activo['ambiente.tipo_ambiente'] + ' ' + activo['ambiente.codigo_ambiente'],
      responsable: persona.nombres + ' ' + persona.apellidos,
      grupo_contable: activo['grupo_contable.descripcion_g'],
      auxiliar: activo['auxiliar.descripcion_aux'],
      codigo_activo: activo.codigo_activo,
      fecha_ingreso: activo.fecha_ingreso,
      descripcion_activo: activo.descripcion_activo,
      cargo_responsable: activo['empleado.cargo.descripcion_cargo'],
      encargado: personaEncargado.nombres + ' ' + personaEncargado.apellidos,
      cargo_encargado: cargo.descripcion_cargo
    }
    const pdf = await crearPDF('actaAsignacion', datosActivo)
    res.contentType('application/pdf');
    res.status(200).send(pdf)
  } catch (error) {
    console.log(error)
    res.status(500).send('Hubo un error')
  }
}

export const codigosActivos = async (_req, res) => {
  try {
    const activos = await Activo.findAll({
      raw: true, where: { estado: 'A' }, attributes: ['codigo_activo']
    })
    const pdf = await crearPDF('listaCodigoActivo', activos)
    res.contentType('application/pdf');
    res.status(200).send(pdf)
  } catch (error) {
    console.log(error)
    res.status(500).send('Hubo un error')
  }
}

export const activosPorCustodio = async (req, res) => {
  try {
    const person = await Person.findOne({ raw: true, where: { id_persona: req.params.idPersona } })

    const activos = await Activo.findAll({
      raw: true, where: {
        estado: 'A',
        id_persona: req.params.idPersona,
        [Op.and]: [
          { id_persona: { [Op.not]: null } },
          { id_persona: { [Op.not]: '' } }
        ],
      },
      include:
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
            attributes: ['descripcion_g', 'vida_util', 'coeficiente']
          },
          {
            model: Proveedor,
            attributes: ['razon_social']
          },
          {
            model: Empleado,
            attributes: ['id_persona', 'id_cargo'],
            include: {
              model: Cargo,
              attributes: ['descripcion_cargo']
            }
          }
        ]
    })
    const allDataActivos = await Promise.all(activos.map(async activo => {
      return await { ...person, ...activo }
    }))
    res.status(200).json(allDataActivos)
  } catch (error) {
    console.log(error)
    res.status(500).send('Hubo un error')
  }
}

export const activosPorGrupo = async (req, res) => {
  try {
    const grupoContable = await GrupoContable.findOne({ raw: true, where: { id_grupo: req.params.idGrupo } })

    const activos = await Activo.findAll({
      raw: true, where: {
        estado: 'A',
        id_grupo: req.params.idGrupo,
        [Op.and]: [
          { id_grupo: { [Op.not]: null } },
          { id_grupo: { [Op.not]: '' } }
        ],
      },
      include:
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
            attributes: ['descripcion_g', 'vida_util', 'coeficiente']
          },
          {
            model: Proveedor,
            attributes: ['razon_social']
          },
          {
            model: Empleado,
            attributes: ['id_persona', 'id_cargo'],
            include: {
              model: Cargo,
              attributes: ['descripcion_cargo']
            }
          }
        ]
    })
    const allDataActivos = await Promise.all(activos.map(async activo => {
      const person = await Person.findOne({ raw: true, where: { id_persona: activo.id_persona } })
      return await { ...grupoContable, ...activo, ...person }
    }))
    res.status(200).json(allDataActivos)
  } catch (error) {
    console.log(error)
    res.status(500).send('Hubo un error')
  }
}

export const activosPorEntidad = async (req, res) => {
  try {
    const entidad = await Proveedor.findOne({ raw: true, where: { id_proveedor: req.params.idEntidad } })

    const activos = await Activo.findAll({
      raw: true, where: {
        estado: 'A',
        id_proveedor: req.params.idEntidad,
        [Op.and]: [
          { id_grupo: { [Op.not]: null } },
          { id_grupo: { [Op.not]: '' } }
        ],
      },
      include:
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
            attributes: ['descripcion_g', 'vida_util', 'coeficiente']
          },
          {
            model: Proveedor,
            attributes: ['razon_social']
          },
          {
            model: Empleado,
            attributes: ['id_persona', 'id_cargo'],
            include: {
              model: Cargo,
              attributes: ['descripcion_cargo']
            }
          }
        ]
    })
    const allDataActivos = await Promise.all(activos.map(async activo => {
      const person = await Person.findOne({ raw: true, where: { id_persona: activo.id_persona } })
      return await { ...entidad, ...activo, ...person }
    }))
    res.status(200).json(allDataActivos)
  } catch (error) {
    console.log(error)
    res.status(500).send('Hubo un error')
  }
}

export const totalAsignados = async (_req, res) => {
  try {
    const totalActivos = await Activo.count({
      where: {
        estado: 'A', [Op.and]: [
          { id_persona: { [Op.not]: null } },
          { id_persona: { [Op.not]: '' } }
        ]
      }
    })
    res.status(200).json(totalActivos)
  } catch (error) {
    console.log(error)
    // res.status(500).send('Hubo un error')
    res.status(500).json({ msg: 'No se pudo encontrar el total' })
  }
}

export const totalActivos = async (_req, res) => {
  try {
    const totalActivos = await Activo.count({
      where: {
        estado: 'A',
      }
    })
    res.status(200).json(totalActivos)
  } catch (error) {
    console.log(error)
    // res.status(500).send('Hubo un error')
    res.status(500).json({ msg: 'No se pudo encontrar el total' })
  }
}


/*
 ******************************************************************************************** 
 */

 export const reporteActivosPorEntidad = async (req, res) => {
  try {
    const entidad = await Proveedor.findOne({
      raw: true,
      where: { id_proveedor: req.params.idEntidad },
    });

    const activos = await Activo.findAll({
      raw: true,
      where: {
        estado: "A",
        id_proveedor: req.params.idEntidad,
        [Op.and]: [
          { id_grupo: { [Op.not]: null } },
          { id_grupo: { [Op.not]: "" } },
        ],
      },
      include: [
        {
          model: Ambiente,
          attributes: ["codigo_ambiente", "tipo_ambiente"],
        },
        {
          model: Auxiliar,
          attributes: ["descripcion_aux"],
        },
        {
          model: GrupoContable,
          attributes: ["descripcion_g", "vida_util", "coeficiente"],
        },
        {
          model: Proveedor,
          attributes: ["razon_social"],
        },
        {
          model: Empleado,
          attributes: ["id_persona", "id_cargo"],
          include: {
            model: Cargo,
            attributes: ["descripcion_cargo"],
          },
        },
      ],
    });
    const allDataActivos = await Promise.all(
      activos.map(async (activo) => {
        let person = await Person.findOne({
          raw: true,
          where: { id_persona: activo.id_persona },
        });
        if(!person){
          person={
            nombres:'no tiene',
            apellidos:'custodio'
          }
        }
        return await {
          ambiente:
            activo["ambiente.tipo_ambiente"] +
            " " +
            activo["ambiente.codigo_ambiente"],
          codigo_activo: activo.codigo_activo,
          descripcion_activo: activo.descripcion_activo,
          grupo_contable: activo["grupo_contable.descripcion_g"],
          entidad: entidad.razon_social,
          custodio: person.nombres|'' + " " + person.apellidos|'',
        };
      })
    );

    const pdf = await crearPDF("listaPorEntidades", allDataActivos);
    res.contentType("application/pdf");
    res.status(200).send(pdf);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

export const reporteActivosPorCustodio = async (req, res) => {
  try {
    const person = await Person.findOne({
      raw: true,
      where: { id_persona: req.params.idPersona },
    });

    const activos = await Activo.findAll({
      raw: true,
      where: {
        estado: "A",
        id_persona: req.params.idPersona,
        [Op.and]: [
          { id_persona: { [Op.not]: null } },
          { id_persona: { [Op.not]: "" } },
        ],
      },
      include: [
        {
          model: Ambiente,
          attributes: ["codigo_ambiente", "tipo_ambiente"],
        },
        {
          model: Auxiliar,
          attributes: ["descripcion_aux"],
        },
        {
          model: GrupoContable,
          attributes: ["descripcion_g", "vida_util", "coeficiente"],
        },
        {
          model: Proveedor,
          attributes: ["razon_social"],
        },
        {
          model: Empleado,
          attributes: ["id_persona", "id_cargo"],
          include: {
            model: Cargo,
            attributes: ["descripcion_cargo"],
          },
        },
      ],
    });
    const allDataActivos = await Promise.all(
      activos.map(async (activo) => {
        return await {
          ambiente:
            activo["ambiente.tipo_ambiente"] +
            " " +
            activo["ambiente.codigo_ambiente"],
          codigo_activo: activo.codigo_activo,
          descripcion_activo: activo.descripcion_activo,
          grupo_contable: activo["grupo_contable.descripcion_g"],
          entidad: activo["proveedor.razon_social"],
          custodio: person.nombres + " " + person.apellidos,
        };
      })
    );

    const pdf = await crearPDF("listaPorCustodio", allDataActivos);
    res.contentType("application/pdf");
    res.status(200).send(pdf);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

export const reporteActivosPorGrupo = async (req, res) => {
  try {
    const activos = await Activo.findAll({
      raw: true,
      where: {
        estado: "A",
        id_grupo: req.params.idGrupo,
        [Op.and]: [
          { id_grupo: { [Op.not]: null } },
          { id_grupo: { [Op.not]: "" } },
        ],
      },
      include: [
        {
          model: Ambiente,
          attributes: ["codigo_ambiente", "tipo_ambiente"],
        },
        {
          model: Auxiliar,
          attributes: ["descripcion_aux"],
        },
        {
          model: GrupoContable,
          attributes: ["descripcion_g", "vida_util", "coeficiente"],
        },
        {
          model: Proveedor,
          attributes: ["razon_social"],
        },
        {
          model: Empleado,
          attributes: ["id_persona", "id_cargo"],
          include: {
            model: Cargo,
            attributes: ["descripcion_cargo"],
          },
        },
      ],
    });
    const allDataActivos = await Promise.all(
      activos.map(async (activo) => {
        const person = await Person.findOne({
          raw: true,
          where: { id_persona: activo.id_persona },
        });
        return await {
          ambiente:
            activo["ambiente.tipo_ambiente"] +
            " " +
            activo["ambiente.codigo_ambiente"],
          codigo_activo: activo.codigo_activo,
          descripcion_activo: activo.descripcion_activo,
          grupo_contable: activo["grupo_contable.descripcion_g"],
          entidad: activo["proveedor.razon_social"],
          custodio: person?person.nombres+ " " + person.apellidos:'--',
        };
      })
    );

    const pdf = await crearPDF("listaPorGrupo", allDataActivos);
    res.contentType("application/pdf");
    res.status(200).send(pdf);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};
