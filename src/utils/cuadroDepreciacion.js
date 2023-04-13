// const activo1 = {
//   codigo: "1",
//   valorInicial: 3700,
//   depAcumulada: 1115.079962,
//   valorResidual: 4460.31985,
//   // indiceUfv: 1.90027,
//   indiceUfv: 2.29076,

// };

// // const ufvActual = 2.29076;
// const ufvActual = 2.33187;
// const porcentajeDep = 25;
// const { depAcumulada, valorResidual, indiceUfv: ufvAnterior } = activo1;


function factorActualizacion(ufvActual, ufvAnterior) {
  return ufvActual / ufvAnterior;
}

function valorActualizado(factorActualizacion, valorRedisual) {
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
  const F = await depAcumulada;
  const G = await incrementoDepAcumulada(depAcumulada, C);
  const H = await depPeriodo(D, porcentajeDep);
  const I = await depAcumuladaActualizada(depAcumulada, G, H);
  const J = await valorNeto(D, I);
  return {
    B, C, D, E, F, G, H, I, J
  }

}