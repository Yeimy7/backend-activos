export const calculoDepreciacionActivoMes = data => {
  const {
    costo,
    coeficiente,
    vida_util,
    fecha_ingreso,
    mes,
    anio
  } = data;
  const depAnual = (costo - coeficiente / 100) / vida_util;
  const depDiaria = depAnual / 360;
  const fecha_texto = anio + '-' + mes + '-30';
  const ms = Date.parse(fecha_texto);
  const today = new Date(ms);
  const back = new Date(fecha_ingreso);
  const diff = Number(((today - back) / 86400000).toFixed(2));
  const total = (costo - diff * depDiaria).toFixed(2);
  return total > 0 ? total : 0.00;
};