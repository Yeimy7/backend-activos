
function factorActualizacion(ufvActual, ufvAnterior) {
  return ufvActual / ufvAnterior;
}

function valorActualizado(factorActualizacion, valorResidual) {
  return valorResidual * factorActualizacion;
}

function incrementoActualizacion(valorActualizado, valorResidual) {
  return valorActualizado - valorResidual;
}

function incrementoDepAcumulada(depAcumulada, factorActualizacion) {
  return depAcumulada * (factorActualizacion - 1);
}

function depPeriodo(valorActualizado, porcentajeDep) {
  return valorActualizado * (porcentajeDep / 100);
}

function depAcumuladaActualizada(depAcumulada, incrementoDepAcu, depPeriodo) {
  return depAcumulada + incrementoDepAcu + depPeriodo;
}

function valorNeto(valorActualizado, depAcumuladaActualizada) {
  return valorActualizado - depAcumuladaActualizada;
}

export const depreciacion = async (valorResidual,
  depAcumulada,
  ufvAnterior,
  ufvActual,
  porcentajeDep) => {
  const B = await valorResidual;
  const C = await factorActualizacion(ufvActual, ufvAnterior);
  const D = await valorActualizado(C, valorResidual);
  const E = await incrementoActualizacion(D, valorResidual);
  const F = depAcumulada;
  const G = await incrementoDepAcumulada(F, C);
  const H = await depPeriodo(D, porcentajeDep);
  const I = await depAcumuladaActualizada(F, G, H);
  const J = await valorNeto(D, I);
  return {
    B: B.toFixed(2),
    C: C.toFixed(2),
    D: D.toFixed(2),
    E: E.toFixed(2),
    F: F.toFixed(2),
    G: G.toFixed(2),
    H: H.toFixed(2),
    I: I.toFixed(2),
    J: J.toFixed(2)
  }

}