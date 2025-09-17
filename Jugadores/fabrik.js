import { NPC, Heroe, Jugadores } from "./personaje.js";


const FABRICA = {
  clases: {
    Heroe,
    NPC,
    Jugadores
  },

  crearHeroe(tipoInstancia, moldeInstancia){
    const HEROE = this._crearInstancia(tipoInstancia, moldeInstancia);
    this._asignarSignals(HEROE, moldeInstancia);
    this._asignarHabilidades(HEROE, moldeInstancia);
    this._asignarMagias(HEROE, moldeInstancia);

    return HEROE
  },

  _crearInstancia(tipoInstancia, moldeInstancia){
    const Clase = this.clases[tipoInstancia];
    console.log("se creó correctamente la instancia");

    return  new Clase(moldeInstancia);
  },
  _asignarSignals(heroe, moldeInstancia){
    moldeInstancia.signals.forEach(
      signal => heroe.asignarSignal(signal.tipoSeñal, signal)
    )
  },

  _asignarHabilidades(heroe, moldeInstancia){
    heroe.aprenderHabilidades(moldeInstancia.habilidades);
  },

  _asignarMagias(heroe, moldeInstancia){
    heroe.aprenderMagias(moldeInstancia.magias);
  }

}

export {FABRICA};