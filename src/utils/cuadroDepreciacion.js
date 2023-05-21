function convertirAFecha(cadena) {
  const arr = cadena.split("-");
  arr[2] = "01";
  return new Date(arr.join("-"));
}

function diferenciaMeses(fecha_ingreso, mesActual, anioActual) {
  // const anio = new Date().getFullYear();
  const ms = Date.parse(anioActual + "-" + mesActual + "-30");
  const today = new Date(ms);
  const back = convertirAFecha(fecha_ingreso);
  return parseInt((today - back) / 2592000000);
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

function depAcumulada(mesesUsados, depMensual) {
  return mesesUsados * depMensual;
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
  const B = await vUtil - mesesUsados;
  const F = await valorActualizado(fa, costo);
  const G = await valorFinalActualizado(valorResidual, F);
  const H = (costo / vUtil);
  const I = await depAcumulada(mesesUsados, H);
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