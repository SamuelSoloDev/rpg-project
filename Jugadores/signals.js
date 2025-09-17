class Signal {
  constructor({
    nombre,
    ejecutar,
    statsPropios,
    tipoSeñal
  }) {
    this.nombre = nombre;
    this.ejecutar = ejecutar;
    this.statsPropios = statsPropios;
    this.tipoSeñal = tipoSeñal;
  }
}



export {Signal}