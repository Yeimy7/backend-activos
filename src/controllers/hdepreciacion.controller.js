import Hdepreciacion from '../models/HDepreciacion'
import Activo from '../models/Activo'
import { validationResult } from 'express-validator'
import ValorUfv from '../models/ValorUfv'
import { Op, Sequelize } from 'sequelize'
import Auxiliar from '../models/Auxiliar'
import GrupoContable from '../models/GrupoContable'
import Proveedor from '../models/Proveedor'
import { depreciacion } from '../utils/cuadroDepreciacion'
import { crearPDF } from '../utils/generarPDF'

export const crearHdepreciacion = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  const { valor_residual, id_activo, id_valor_ufv } = req.body
  try {
    //Guardar datos del historial de depreciacion
    const activo = await Activo.findOne({ raw: true, where: { id_activo: id_activo } })
    if (!activo) return res.status(404).json({ msg: 'Activo no encontrado' })

    const valor_ufv = await ValorUfv.findOne({ raw: true, where: { id_valor_ufv: id_valor_ufv } })
    if (!valor_ufv) return res.status(404).json({ msg: 'Valor UFV no encontrado' })

    //Guardar el datos de depreciacion y actualizar el activo
    const resultado = await Hdepreciacion.create({ valor_residual, id_activo, id_valor_ufv })

    res.status(201).json(resultado)
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: 'Hubo un error al intentar registrar la hdepreciacion' })
  }
}
export const obtenerHDepreciaciones = async (_req, res) => {
  try {
    const hdepreciaciones = await Hdepreciacion.findAll({
      raw: true, include:
        [
          {
            model: Activo,
            attributes: ['descripcion_activo', 'codigo_activo']
          },
          {
            model: ValorUfv,
            attributes: ['gestion', 'valor']
          },
        ]
    })
    res.status(200).json(hdepreciaciones)
  } catch (error) {
    res.status(500).json({ msg: 'Hubo un error al recuperar datos de los historicos de depreciacion' })
  }
}

export const obtenerHdepreciacionPorId = async (req, res) => {
  try {
    const hdepreciacion = await Hdepreciacion.findOne({
      raw: true, where: { id_hdepreciacion: req.params.hdepreciacionId }, include:
        [
          {
            model: Activo,
            attributes: ['descripcion_activo', 'codigo_activo']
          },
          {
            model: ValorUfv,
            attributes: ['gestion', 'valor']
          },
        ]
    })
    res.status(200).json(hdepreciacion)
  } catch (error) {
    res.status(500).send('Hubo un error')
  }
}

export const obtenerHdepreciacionPorIdActivo = async (req, res) => {
  try {
    const { id_activo } = req.body

    const hdepreciacion = await Hdepreciacion.findAll({
      raw: true, where: { id_activo }
    })
    res.status(200).json(hdepreciacion)
  } catch (error) {
    res.status(500).send('Hubo un error')
  }
}

export const crearHdepreciaciones = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }
  // La gestion debe ser la pasada para buscar en la tabla 
  // hdepreciaciones y actualizarla con el nuevo valor
  const { valor_ufv, gestion } = req.body
  try {
    const hdepreciaciones = await Hdepreciacion.findAll({
      raw: true, include:
        [
          {
            model: Activo,
            where: { estado: 'A' }
          },
          {
            model: ValorUfv,
            where: { gestion }
          }
        ]
    })
    const valorUfv = await ValorUfv.findAll({
      where: { gestion: `${gestion + 1}` },
      raw: true,
    })
    await Promise.all(hdepreciaciones.map(async hdepreciacion => {
      const { id_activo, valor_residual, ['activo.indice_ufv']: indice_ufv } = hdepreciacion
      const ajusteActualizacion = ((valor_residual / indice_ufv) * valor_ufv - valor_residual)

      await Hdepreciacion.create({ valor_residual: (ajusteActualizacion + valor_residual), id_activo, id_valor_ufv: valorUfv[0].id_valor_ufv })
      return
    }))
    res.status(200).json({ msj: 'Depreciaciones realizadas exitosamente' })
  } catch (error) {
    console.log(error);
    res.status(400).json({ msj: 'Hubo un error al intentar registrar la hdepreciacion' })
  }
}

export const cuadroDepreciacion = async (req, res) => {
  const { id_grupo, gestion } = req.body
  try {

    const hdepreciaciones = await Hdepreciacion.findAll({
      raw: true, include:
        [
          {
            model: Activo,
            where: {
              estado: 'A',
              id_grupo: id_grupo,
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
          },
          {
            model: ValorUfv,
            where: { gestion: gestion - 1 }
          }
        ]
    })
    const valorUfv = await ValorUfv.findAll({
      raw: true, where: { gestion }
    })

    const itemsActivos = await Promise.all(hdepreciaciones?.map(async activo => {
      const valores = await depreciacion(activo['activo.fecha_ingreso'], 12, gestion, activo['activo.grupo_contable.vida_util'], activo['activo.costo'], activo.valor_residual, activo['activo.indice_ufv'], valorUfv[0].valor)
      const { B, F, G, H, I, J, K, L } = valores;
      return await {
        // ...activo,
        codigo: activo['activo.codigo_activo'],
        grupo_contable: activo['activo.grupo_contable.descripcion_g'],
        auxiliar: activo['activo.auxiliar.descripcion_aux'],
        vida_util: activo['activo.grupo_contable.vida_util'],
        descripcion: activo['activo.descripcion_activo'],
        A: activo['activo.fecha_ingreso'],
        C: activo['activo.indice_ufv'],
        D: activo['activo.costo'],
        E: activo.valor_residual,
        B: Number(B), F, G, H, I, J, K, L
      }
    }))

    // console.log(itemsActivos)
    // res.status(201);
    const pdf = await crearPDF('cuadroDepreciacion',
      {
        grupo_contable: itemsActivos[0]?.grupo_contable,
        vida_util: itemsActivos[0]?.vida_util * 12,
        ufv_actual: valorUfv[0]?.valor,
        data: itemsActivos
      })
    res.contentType('application/pdf');
    res.status(200).send(pdf)
    // res.status(200).send(itemsActivos)

  } catch (error) {
    console.log(error)
    res.status(500).send('Hubo un error')
  }
}

// export const obtenerHdepreciacionPorIdActivoGestion = async (req, res) => {
//   try {
//     const { gestion, id_activo } = req.body

//     const hdepreciacion = await Hdepreciacion.findAll({
//       raw: true, where: { id_activo, gestion }
//     })
//     res.status(200).json(hdepreciacion)
//   } catch (error) {
//     res.status(500).send('Hubo un error')
//   }
// }


