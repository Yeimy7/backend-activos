import { crearPDF } from '../utils/generarPDF.js';
import { validationResult } from 'express-validator';
import Activo from '../models/Activo.js';
import Ambiente from '../models/Ambiente.js';
import Auxiliar from '../models/Auxiliar.js';
import Cargo from '../models/Cargo.js';
import Devolucion from '../models/Devolucion.js';
import Empleado from '../models/Empleado.js';
import GrupoContable from '../models/GrupoContable.js';
import Person from '../models/Person.js';
export const crearDevolucion = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    let err = errores.errors.map(mensaje => mensaje.msg);
    return res.status(400).json({
      msg: err.join(),
      type: 'error'
    });
  }

  const {
    motivo_devolucion,
    fecha_asignacion,
    id_activo,
    id_persona
  } = req.body;

  try {
    //Guardar datos de Devolucion
    const activo = await Activo.findOne({
      raw: true,
      where: {
        id_activo: id_activo
      }
    });
    if (!activo) return res.status(404).json({
      msg: 'Activo no encontrado',
      type: 'error'
    });
    const empleado = await Empleado.findOne({
      where: {
        id_persona: id_persona
      }
    });
    if (!empleado) return res.status(404).json({
      msg: 'Empleado no encontrado',
      type: 'error'
    });
    const persona = await Person.findOne({
      where: {
        id_persona: id_persona
      }
    });
    const newDevolucion = {
      motivo_devolucion,
      fecha_asignacion,
      id_activo,
      id_persona
    }; //Guardar la devolucion y actualizar el activo

    const resultado = await Devolucion.create(newDevolucion);
    res.status(201).json({
      id_devolucion: resultado.id_devolucion,
      fecha_devolucion: resultado.fecha_devolucion,
      motivo_devolucion,
      fecha_asignacion,
      'activo.descripcion_activo': activo.descripcion_activo,
      'emplado.nombres': persona.nombres,
      'empleado.apellidos': persona.apellidos
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Error en el servidor, intente nuevemente',
      type: 'error'
    });
  }
};
export const obtenerDevoluciones = async (_req, res) => {
  try {
    const devoluciones = await Devolucion.findAll({
      raw: true,
      include: {
        model: Activo,
        attributes: ['descripcion_activo']
      }
    });
    const datosDevoluciones = await Promise.all(devoluciones.map(async devolucion => {
      const persona = await Person.findOne({
        raw: true,
        where: {
          id_persona: devolucion.id_persona
        }
      });
      return await {
        'empleado.nombres': persona.nombres,
        'empleado.apellidos': persona.apellidos,
        ...devolucion
      };
    }));
    res.status(200).json(datosDevoluciones);
  } catch (error) {
    res.status(500).json({
      msg: 'Error en el servidor, intente nuevemente',
      type: 'error'
    });
  }
};
export const obtenerDevolucionPorId = async (req, res) => {
  try {
    const devolucion = await Devolucion.findOne({
      raw: true,
      where: {
        id_devolucion: req.params.devolucionId
      },
      include: {
        model: Activo,
        attributes: ['descripcion_activo']
      }
    });
    const persona = await Person.findOne({
      raw: true,
      where: {
        id_persona: devolucion.id_persona
      }
    });
    const datosDevolucion = await {
      'empleado.nombres': persona.nombres,
      'empleado.apellidos': persona.apellidos,
      ...devolucion
    };
    res.status(200).json(datosDevolucion);
  } catch (error) {
    res.status(500).json({
      msg: 'Error en el servidor, intente nuevemente',
      type: 'error'
    });
  }
};
export const actaDevolucionActivo = async (req, res) => {
  //Buscar cargo jefe de unidad de activos fijos 
  const {
    id_devolucion
  } = req.body;

  try {
    const devolucion = await Devolucion.findOne({
      raw: true,
      where: {
        id_devolucion
      }
    });
    const activo = await Activo.findOne({
      raw: true,
      where: {
        id_activo: devolucion.id_activo
      },
      include: [{
        model: Ambiente,
        attributes: ['codigo_ambiente', 'tipo_ambiente']
      }, {
        model: Auxiliar,
        attributes: ['descripcion_aux']
      }, {
        model: GrupoContable,
        attributes: ['descripcion_g', 'vida_util', 'coeficiente']
      }]
    });
    const empleado = await Empleado.findOne({
      raw: true,
      where: {
        id_persona: devolucion.id_persona
      },
      include: [{
        model: Cargo,
        attributes: ['descripcion_cargo']
      }]
    });
    const persona = await Person.findOne({
      raw: true,
      where: {
        id_persona: devolucion.id_persona
      }
    });
    const cargo = await Cargo.findOne({
      raw: true,
      where: {
        descripcion_cargo: 'Jefe de unidad de activos fijos'
      }
    });
    const encargado = await Empleado.findOne({
      raw: true,
      where: {
        id_cargo: cargo.id_cargo
      }
    });
    const personaEncargado = await Person.findOne({
      raw: true,
      where: {
        id_persona: encargado.id_persona
      }
    });
    const datosActivo = {
      oficina: activo['ambiente.tipo_ambiente'] + ' ' + activo['ambiente.codigo_ambiente'],
      responsable: persona.nombres + ' ' + persona.apellidos,
      grupo_contable: activo['grupo_contable.descripcion_g'],
      auxiliar: activo['auxiliar.descripcion_aux'],
      codigo_activo: activo.codigo_activo,
      fecha_ingreso: activo.fecha_ingreso,
      descripcion_activo: activo.descripcion_activo,
      motivo: devolucion.motivo_devolucion,
      cargo_responsable: empleado['cargo.descripcion_cargo'],
      encargado: personaEncargado.nombres + ' ' + personaEncargado.apellidos,
      cargo_encargado: cargo.descripcion_cargo
    };
    const pdf = await crearPDF('actaDevolucion', datosActivo);
    res.contentType('application/pdf');
    res.status(200).send(pdf);
  } catch (error) {
    res.status(500).json({
      msg: 'Error en el servidor, intente nuevemente',
      type: 'error'
    });
  }
};