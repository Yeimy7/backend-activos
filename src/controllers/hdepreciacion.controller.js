import path from 'path'
import fs from 'fs-extra'
import xl from 'excel4node'
import { crearPDF } from '../utils/generarPDF'
import { depreciacion } from '../utils/cuadroDepreciacion'
import { Op, Sequelize } from 'sequelize'
import { validationResult } from 'express-validator'
import Activo from '../models/Activo'
import Auxiliar from '../models/Auxiliar'
import GrupoContable from '../models/GrupoContable'
import Hdepreciacion from '../models/HDepreciacion'
import Proveedor from '../models/Proveedor'
import ValorUfv from '../models/ValorUfv'

export const crearHdepreciacion = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    let err = errores.errors.map(mensaje => (mensaje.msg))
    return res.status(400).json({ msg: err.join(), type: 'error' })
  }
  const { valor_residual, id_activo, id_valor_ufv } = req.body
  try {
    //Guardar datos del historial de depreciacion
    const activo = await Activo.findOne({ raw: true, where: { id_activo: id_activo } })
    if (!activo) return res.status(404).json({ msg: 'Activo no encontrado', type: 'error' })

    const valor_ufv = await ValorUfv.findOne({ raw: true, where: { id_valor_ufv: id_valor_ufv } })
    if (!valor_ufv) return res.status(404).json({ msg: 'Valor UFV no encontrado', type: 'error' })

    //Guardar el datos de depreciacion y actualizar el activo
    const resultado = await Hdepreciacion.create({ valor_residual, id_activo, id_valor_ufv })

    res.status(201).json(resultado)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
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
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
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
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
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
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
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
    const activos = await Activo.findAll({
      raw: true,
      attributes: ['id_activo', 'costo', 'indice_ufv', 'descripcion_activo'],
      where: {
        estado: 'A', [Op.and]: [
          Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('fecha_ingreso')), (gestion + 1)),
        ]
      }
    });
    await Promise.all(hdepreciaciones.map(async hdepreciacion => {
      const { id_activo, valor_residual, ['activo.indice_ufv']: indice_ufv } = hdepreciacion
      const ajusteActualizacion = ((valor_residual / indice_ufv) * valor_ufv - valor_residual)

      await Hdepreciacion.create({ valor_residual: (ajusteActualizacion + valor_residual), id_activo, id_valor_ufv: valorUfv[0].id_valor_ufv })
      return
    }))
    await Promise.all(activos.map(async activo => {
      const { id_activo, costo, indice_ufv } = activo
      const ajusteActualizacion = ((costo / indice_ufv) * valor_ufv - costo)

      await Hdepreciacion.create({ valor_residual: (ajusteActualizacion + costo), id_activo, id_valor_ufv: valorUfv[0].id_valor_ufv })
      return
    }))
    res.status(200).json({ msg: 'Depreciaciones realizadas exitosamente', type: 'success' })
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}

export const cuadroDepreciacion = async (req, res) => {
  const { id_grupo, gestion, isPdf } = req.body;
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
    let td = 0, te = 0, tf = 0, tg = 0, th = 0, ti = 0, tj = 0, tk = 0, tl = 0
    const itemsActivos = await Promise.all(hdepreciaciones?.map(async activo => {
      const valores = await depreciacion(activo['activo.fecha_ingreso'], 12, gestion, activo['activo.grupo_contable.vida_util'], activo['activo.costo'], activo.valor_residual, activo['activo.indice_ufv'], valorUfv[0].valor)
      const { B, F, G, H, I, J, K, L } = valores;
      td = td + Number(activo['activo.costo'])
      te = te + Number(activo.valor_residual)
      tf = tf + Number(F)
      tg = tg + Number(G)
      th = th + Number(H)
      ti = ti + Number(I)
      tj = tj + Number(J)
      tk = tk + Number(K)
      tl = tl + Number(L)

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
    const valores = {
      grupo_contable: itemsActivos[0]?.grupo_contable,
      vida_util: itemsActivos[0]?.vida_util * 12,
      ufv_actual: valorUfv[0]?.valor,
      gestion,
      data: itemsActivos,
      td:Number(td.toFixed(2)),
      te:Number(te.toFixed(2)),
      tf:Number(tf.toFixed(2)),
      tg:Number(tg.toFixed(2)),
      th:Number(th.toFixed(2)),
      ti:Number(ti.toFixed(2)),
      tj:Number(tj.toFixed(2)),
      tk:Number(tk.toFixed(2)),
      tl:Number(tl.toFixed(2))
    }

    if (isPdf) {
      const pdf = await crearPDF('cuadroDepreciacion', valores)
      res.contentType('application/pdf');
      res.status(200).send(pdf)
    } else {
      // Fecha
      let date = new Date()
      let fechaDia = date.getUTCDate()
      let fechaMes = (date.getUTCMonth()) + 1;
      let fechaAnio = date.getUTCFullYear();

      let wb = new xl.Workbook();
      let nombreArchivo = `cuadroActivos${fechaDia}_${fechaMes}_${fechaAnio}`

      let ws = wb.addWorksheet(nombreArchivo)

      let columnaEstilo = wb.createStyle({
        font: {
          name: 'Arial',
          color: '#000000',
          size: 10,
          bold: true
        },
        alignment: {
          horizontal: 'center',
        },
      })
      let titulo = wb.createStyle({
        font: {
          name: 'Arial',
          color: '#000000',
          size: 10,
          bold: true,
          italics: true,

        },
        alignment: {
          horizontal: 'center',
        },
      })

      let contenidoEstilo = wb.createStyle({
        font: {
          name: 'Arial',
          color: '#494949',
          size: 8,
          bold: false
        }
      })
      ws.cell(1, 1, 1, 4, true).string('CENTRO VIRGEN NIÑA - EPDB').style(titulo);
      ws.cell(2, 1, 2, 4, true).string(`ACTIVO FIJO AL 31 DE DICIEMBRE DE ${gestion}`).style(titulo);

      ws.column(1).setWidth(12)
      ws.column(4).setWidth(5)
      ws.column(5).setWidth(25)
      ws.column(6).setWidth(5)
      ws.column(7).setWidth(5)
      ws.column(8).setWidth(5)
      ws.column(9).setWidth(7)
      ws.column(10).setWidth(12)
      ws.column(11).setWidth(12)
      ws.column(12).setWidth(12)
      ws.column(13).setWidth(12)
      ws.column(14).setWidth(12)
      ws.column(15).setWidth(12)
      ws.column(16).setWidth(12)
      ws.column(17).setWidth(12)
      ws.column(18).setWidth(12)
      ws.column(19).setWidth(12)
      //NOmbre de las columnas

      ws.cell(3, 12).string(`UFV's al 31/12/${gestion}`).style(columnaEstilo)
      ws.cell(3, 14).number(valorUfv[0]?.valor).style(columnaEstilo)

      ws.cell(4, 7).string('Vida').style(columnaEstilo);
      ws.cell(4, 8).string('Vida').style(columnaEstilo);
      ws.cell(4, 10).string('Valor inicial').style(columnaEstilo);
      ws.cell(4, 11).string(`Valor final ${gestion - 1}`).style(columnaEstilo);
      ws.cell(4, 12).string('Ajuste').style(columnaEstilo);
      ws.cell(4, 13).string('Valor Final').style(columnaEstilo);
      ws.cell(4, 14).string('Depreciación mensual').style(columnaEstilo);
      ws.cell(4, 15).string('Depreciación anual').style(columnaEstilo);
      ws.cell(4, 16).string('Depreciación acumulada').style(columnaEstilo);
      ws.cell(4, 17).string('Ajuste').style(columnaEstilo);
      ws.cell(4, 18).string('Deprec.').style(columnaEstilo);
      ws.cell(4, 19).string('Valor residual').style(columnaEstilo);


      ws.cell(5, 1).string('Grupo').style(columnaEstilo)
      ws.cell(5, 2).string('Código').style(columnaEstilo)
      ws.cell(5, 3).string('Fecha ingreso').style(columnaEstilo)
      ws.cell(5, 4).string('Nro').style(columnaEstilo)
      ws.cell(5, 5).string('Descripcion').style(columnaEstilo)
      ws.cell(5, 6).string('Cant.').style(columnaEstilo)
      ws.cell(5, 7).string('Util').style(columnaEstilo)
      ws.cell(5, 8).string('Res.').style(columnaEstilo)
      ws.cell(5, 10).string('Bolivianos').style(columnaEstilo)
      ws.cell(5, 11).string('Bolivianos').style(columnaEstilo)
      ws.cell(5, 12).string('Actualización').style(columnaEstilo)
      ws.cell(5, 13).string('Actualizado').style(columnaEstilo)
      ws.cell(5, 14).string('Bolivianos').style(columnaEstilo)
      ws.cell(5, 15).string('Bolivianos').style(columnaEstilo)
      ws.cell(5, 16).string('Bolivianos').style(columnaEstilo)
      ws.cell(5, 17).string('Actualización').style(columnaEstilo)
      ws.cell(5, 18).string('Actualizada').style(columnaEstilo)
      ws.cell(5, 19).string('Actualizado').style(columnaEstilo)

      let pos = 6;

      itemsActivos.forEach((activo, index) => {
        ws.cell(index + 6, 1).string(valores.grupo_contable).style(contenidoEstilo)
        ws.cell(index + 6, 2).string(activo.codigo).style(contenidoEstilo)
        ws.cell(index + 6, 3).string(activo.A).style(contenidoEstilo)
        ws.cell(index + 6, 4).number(index + 1).style(contenidoEstilo)
        ws.cell(index + 6, 5).string(activo.descripcion).style(contenidoEstilo)
        ws.cell(index + 6, 7).number(valores.vida_util).style(contenidoEstilo)
        ws.cell(index + 6, 8).number(activo.B).style(contenidoEstilo)
        ws.cell(index + 6, 9).number(activo.C).style(contenidoEstilo)
        ws.cell(index + 6, 10).number(activo.D).style(contenidoEstilo)
        ws.cell(index + 6, 11).number(activo.E).style(contenidoEstilo)
        ws.cell(index + 6, 12).string(activo.F).style(contenidoEstilo)
        ws.cell(index + 6, 13).string(activo.G).style(contenidoEstilo)
        ws.cell(index + 6, 14).string(activo.H).style(contenidoEstilo)
        ws.cell(index + 6, 15).string((Number(activo.H) * 12).toFixed(2)).style(contenidoEstilo)
        ws.cell(index + 6, 16).string(activo.I).style(contenidoEstilo)
        ws.cell(index + 6, 17).string(activo.J).style(contenidoEstilo)
        ws.cell(index + 6, 18).string(activo.K).style(contenidoEstilo)
        ws.cell(index + 6, 19).string(activo.L).style(contenidoEstilo)
        pos++;
      });
      ws.cell(pos, 5).string(`TOTAL ${valores.grupo_contable}`).style(columnaEstilo)
      ws.cell(pos, 10).number(valores.td).style(contenidoEstilo)
      ws.cell(pos, 11).number(valores.te).style(contenidoEstilo)
      ws.cell(pos, 12).number(valores.tf).style(contenidoEstilo)
      ws.cell(pos, 13).number(valores.tg).style(contenidoEstilo)
      ws.cell(pos, 14).number(valores.th).style(contenidoEstilo)
      ws.cell(pos, 16).number(valores.ti).style(contenidoEstilo)
      ws.cell(pos, 17).number(valores.tj).style(contenidoEstilo)
      ws.cell(pos, 18).number(valores.tk).style(contenidoEstilo)
      ws.cell(pos, 19).number(valores.tl).style(contenidoEstilo)


      //Ruta del archivo
      const pathExcel = path.join(__dirname, 'excel', nombreArchivo + '.xlsx')

      //Escribir o guardar
      wb.write(pathExcel, async (err, stats) => {
        if (err) {
          res.status(500).json({ msg: 'Error al crear el archivo Excel', type: 'error' });
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
    }
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevemente', type: 'error' })
  }
}




