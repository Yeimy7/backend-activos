import fs from 'fs-extra'
import path from 'path'
import xl from 'excel4node'
import { crearPDF } from '../utils/generarPDF.js'
import { Op } from 'sequelize'
import { validationResult } from 'express-validator'
import Activo from '../models/Activo.js'
import Ambiente from '../models/Ambiente.js'
import Area from '../models/Area.js'
import Auxiliar from '../models/Auxiliar.js'
import Cargo from '../models/Cargo.js'
import Edificio from '../models/Edificio.js'
import Empleado from '../models/Empleado.js'
import GrupoContable from '../models/GrupoContable.js'
import Person from '../models/Person.js'
import Piso from '../models/Piso.js'
import Proveedor from '../models/Proveedor.js'

export const crearActivo = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    let err = errores.errors.map(mensaje => (mensaje.msg))
    return res.status(400).json({ msg: err.join(), type: 'error' })
  }
  const { codigo_activo, fecha_ingreso, descripcion_activo, costo, valor_residual, indice_ufv, img_activo, codigo_ambiente, descripcion_aux, descripcion_g, razon_social } = req.body
  try {
    const ambiente = await Ambiente.findOne({ where: { codigo_ambiente: codigo_ambiente } })
    if (!ambiente) return res.status(404).json({ msg: 'Ambiente no encontrado', type: 'error' })

    const auxiliar = await Auxiliar.findOne({ where: { descripcion_aux: descripcion_aux } })
    if (!auxiliar) return res.status(404).json({ msg: 'Auxiliar no encontrado', type: 'error' })

    const grupo = await GrupoContable.findOne({ where: { descripcion_g: descripcion_g } })
    if (!grupo) return res.status(404).json({ msg: 'Grupo contable no encontrado', type: 'error' })

    const proveedor = await Proveedor.findOne({ where: { razon_social: razon_social } })
    if (!proveedor) return res.status(404).json({ msg: 'Entidad no encontrada', type: 'error' })

    const newActivo = {
      codigo_activo,
      fecha_ingreso,
      descripcion_activo,
      costo,
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
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
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
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
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
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
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
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
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
      return res.status(404).json({ msg: 'Activo no encontrado', type: 'error' })
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
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const bajaActivoPorId = async (req, res) => {
  try {
    let activo = await Activo.findByPk(req.params.activoId)

    if (!activo) {
      return res.status(404).json({ msg: 'Activo no encontrado', type: 'error' })
    }
    activo.estado = 'I'
    const bajaActivo = await activo.save()
    res.status(200).json(bajaActivo)
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const actualizarImagenActivoPorId = async (req, res) => {

  try {
    // Revisar el ID
    let activo = await Activo.findByPk(req.params.activoId)
    if (!activo) {
      return res.status(400).json({ msg: 'El activo no existe', type: 'error' })
    }

    if (activo.img_activo) {
      await fs.unlink(path.resolve(activo.img_activo))
    }
    activo.img_activo = req.file.path
    const result = await activo.save()
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const asignarActivo = async (req, res) => {
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    let err = x.errores.errors.map(mensaje => (mensaje.msg))
    return res.status(400).json({ msg: err.join(), type: 'error' })
  }
  const { id_activo, id_persona } = req.body
  try {
    // Revisar el ID
    let activo = await Activo.findByPk(id_activo)
    if (!activo) {
      return res.status(404).json({ msg: 'Activo no encontrado', type: 'error' })
    }
    let empleado = await Empleado.findByPk(id_persona)
    if (!empleado) {
      return res.status(404).json({ msg: 'Empleado no encontrado', type: 'error' })
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
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
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
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}
export const activosNoAsignados = async (_req, res) => {
  try {
    const activos = await Activo.findAll({
      raw: true, where: {
        estado: 'A', [Op.or]: [
          { id_persona: { [Op.eq]: null } },
          { id_persona: { [Op.eq]: '' } }
        ]
      },
      order: ['codigo_activo']
    })
    res.status(200).json(activos)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const desvincularActivo = async (req, res) => {
  const { id_activo } = req.body
  try {
    // Revisar el ID
    let activo = await Activo.findByPk(id_activo)
    if (!activo) {
      return res.status(404).json({ msg: 'Activo no encontrado', type: 'error' })
    }

    activo.fecha_asig_empleado = null
    activo.id_persona = null

    const activoAsignado = await activo.save()

    res.status(200).json(activoAsignado)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
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
      return res.status(404).json({ msg: 'Activo no encontrado', type: 'error' })
    }
    let ambiente = await Ambiente.findByPk(id_ambiente)
    if (!ambiente) {
      return res.status(404).json({ msg: 'Ambiente no encontrado', type: 'error' })
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
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
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
          },
          {
            model: GrupoContable,
            attributes: ['descripcion_g']
          }
        ]
    })
    const itemsActivos = activos.map((activo, index) => {
      return {
        ...activo,
        num: index + 1,
        tipo_codigo_ambiente: `${activo['ambiente.tipo_ambiente']} ${activo['ambiente.codigo_ambiente']}`,
        grupo: activo['grupo_contable.descripcion_g'],
      }
    })
    const pdf = await crearPDF('listaActivos', itemsActivos)
    res.contentType('application/pdf');
    res.status(200).send(pdf)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const listaActivosExcel = async (_req, res) => {

  // Fecha
  let date = new Date()
  let fechaDia = date.getUTCDate()
  let fechaMes = (date.getUTCMonth()) + 1;
  let fechaAnio = date.getUTCFullYear();

  try {
    const activos = await Activo.findAll({
      raw: true, where: { estado: 'A' }, include:
        [
          {
            model: Ambiente,
            attributes: ['codigo_ambiente', 'tipo_ambiente']
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

    let wb = new xl.Workbook();
    let nombreArchivo = `listaActivos${fechaDia}_${fechaMes}_${fechaAnio}`

    let ws = wb.addWorksheet(nombreArchivo)

    let columnaEstilo = wb.createStyle({
      font: {
        name: 'Arial',
        color: '#000000',
        size: 13,
        bold: true
      }
    })

    let contenidoEstilo = wb.createStyle({
      font: {
        name: 'Arial',
        color: '#494949',
        size: 12,
        bold: false
      }
    })
    ws.column(1).setWidth(5)
    ws.column(3).setWidth(35)
    ws.column(5).setWidth(25)
    ws.column(6).setWidth(25)
    //NOmbre de las columnas
    ws.cell(1, 1).string('Nro').style(columnaEstilo)
    ws.cell(1, 2).string('Código').style(columnaEstilo)
    ws.cell(1, 3).string('Descripcion').style(columnaEstilo)
    ws.cell(1, 4).string('Fecha ingreso').style(columnaEstilo)
    ws.cell(1, 5).string('Ambiente').style(columnaEstilo)
    ws.cell(1, 6).string('Grupo').style(columnaEstilo)
    ws.cell(1, 7).string('Entidad').style(columnaEstilo)

    activos.forEach((activo, index) => {
      ws.cell(index + 2, 1).number(index + 1).style(contenidoEstilo)
      ws.cell(index + 2, 2).string(activo.codigo_activo).style(contenidoEstilo)
      ws.cell(index + 2, 3).string(activo.descripcion_activo).style(contenidoEstilo)
      ws.cell(index + 2, 4).string(activo.fecha_ingreso).style(contenidoEstilo)
      ws.cell(index + 2, 5).string(`${activo['ambiente.tipo_ambiente']} ${activo['ambiente.codigo_ambiente']}`).style(contenidoEstilo)
      ws.cell(index + 2, 6).string(activo['grupo_contable.descripcion_g']).style(contenidoEstilo)
      ws.cell(index + 2, 7).string(activo['proveedor.razon_social']).style(contenidoEstilo)
    });

    //Ruta del archivo
    const pathExcel = path.join(__dirname, 'excel', nombreArchivo + '.xlsx')

    //Escribir o guardar
    wb.write(pathExcel, async (err, stats) => {
      if (err) {
        res.status(500).json({ msg: 'Error al crear el archivo Excel', type: 'error' })
      }
      else {
        res.setHeader('Content-Disposition', 'attachment; filename=archivo.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.sendFile(pathExcel, (error) => {
          if (error) {
            res.status(500).json({ msg: 'Error al enviar el archivo Excel al cliente', type: 'error' })
          }
          // Eliminar el archivo después de servirlo
          fs.unlink(pathExcel, (unlinkError) => {
            if (unlinkError) {
              console.error('Error al eliminar el archivo', unlinkError);
            } else {
              console.log('Archivo descargado y eliminado correctamente');
            }
          });
        });
      }
    })
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

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
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const codigosActivos = async (req, res) => {
  let { codigoActivos } = req.body
  try {
    let activos
    if (codigoActivos !== null && codigoActivos !== '') {
      activos = codigoActivos
    } else {
      activos = await Activo.findAll({
        raw: true, where: { estado: 'A' }, attributes: ['codigo_activo']
      })
    }
    const pdf = await crearPDF('listaCodigoActivo', activos)
    res.contentType('application/pdf');
    res.status(200).send(pdf)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
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
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
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
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
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
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
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
    res.status(500).json({ msg: 'No se pudo encontrar el total', type: 'error' })
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
    res.status(500).json({ msg: 'No se pudo encontrar el total', type: 'error' })
  }
}

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
        return await {
          ambiente:
            activo["ambiente.tipo_ambiente"] +
            " " +
            activo["ambiente.codigo_ambiente"],
          codigo_activo: activo.codigo_activo,
          descripcion_activo: activo.descripcion_activo,
          grupo_contable: activo["grupo_contable.descripcion_g"],
          entidad: entidad.razon_social,
          custodio: person ? person.nombres + " " + person.apellidos : '--',
        };
      })
    );

    const pdf = await crearPDF("listaPorEntidades", allDataActivos);
    res.contentType("application/pdf");
    res.status(200).send(pdf);
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
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
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
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
          custodio: person ? person.nombres + " " + person.apellidos : '--',
        };
      })
    );

    const pdf = await crearPDF("listaPorGrupo", allDataActivos);
    res.contentType("application/pdf");
    res.status(200).send(pdf);
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
};
