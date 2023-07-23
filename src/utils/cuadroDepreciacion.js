
function diferenciaMeses(fecha_ingreso, mesActual, anioActual) {
  const anios = anioActual-extraerAnio(fecha_ingreso)
  const total=12-(extraerMes(fecha_ingreso)-1)
  return total+(12*anios)
}

function extraerAnio(cadena){
  return cadena.split("-")[0]
}

function extraerMes(cadena){
  return cadena.split("-")[1]
}

function factorActualizacion(ufvActual, ufvAnterior) {
  return ufvActual / ufvAnterior;
}

function valorActualizado(factorActualizacion, valorInicial) {
  return (factorActualizacion * valorInicial) - valorInicial;
}

function valorFinalActualizado(valorResidual, ajusteActualizacion) {
  return valorResidual + ajusteActualizacion;
}

function depAcumulada(depMensual, vida_util, mesesUsados) {
  return depMensual * (vida_util - mesesUsados);
}

function ajusteActualizacion(factorActualizacion, depAcumulada) {
  return (factorActualizacion * depAcumulada) - depAcumulada;
}

function depActualizada(depAcumulada, ajusteActualizacion) {
  return depAcumulada + ajusteActualizacion;
}

function valorResidualActualizado(valorFinalActualizado, depActualizada) {
  return valorFinalActualizado - depActualizada;
}

export const depreciacion = async (
  fecha_ingreso,
  mesActual,
  anioActual,
  vida_util,
  costo,
  valorResidual,
  ufvAnterior,
  ufvActual,
) => {
  const mesesUsados = await diferenciaMeses(fecha_ingreso, mesActual, anioActual)
  const vUtil = vida_util * 12
  const fa = await factorActualizacion(ufvActual, ufvAnterior);
  const B = mesesUsados > vUtil ? 0 : vUtil - mesesUsados;
  // const B = await vUtil - mesesUsados;
  const F = valorActualizado(fa, valorResidual);
  const G = await valorFinalActualizado(valorResidual, F);
  const H = (costo / vUtil);
  const I = await depAcumulada(H, vUtil, B);
  const J = await ajusteActualizacion(fa, I);
  const K = await depActualizada(I, J);
  const L = await valorResidualActualizado(G, K);
  return {
    B: B.toFixed(2),
    F: F.toFixed(2),
    G: G.toFixed(2),
    H: H.toFixed(2),
    I: I.toFixed(2),
    J: J.toFixed(2),
    K: K.toFixed(2),
    L: L.toFixed(2)
  }
}