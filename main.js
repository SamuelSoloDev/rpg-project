import menuPersonaje from "./menuUi.js"
import turnManager from './turnManager.js';
import{pjInterface, actualizarUi} from './personajeInterface.js';


class Jugadores {
  constructor(nombre, grupo, vida, atq, vel) {
    this.nombre = nombre;
    this.grupo = grupo;
    this.atq = atq;
    this.vel = vel;
    this._vivo = true;
    this.vida = vida;
    this._carga = 0;
  }
  get vida(){
    return this._vida;
  }
  get vivo(){
    return this._vivo;
  }

  get carga(){
    return this._carga;
  }

  set vida(valor){
    this._vida = valor;
    if (this._vida <= 0 && this._vivo) {
      this._vivo = false;
    }
    if (this._vida < 0) {
      this._vida = 0;
    }
  }

  set carga(valor){
    this._carga = valor;
    if (this._carga > 100){
      this._carga = 100;
    }
  }


  atacar(enemigo){
    enemigo.recibirDamage(this.atq);
  }

  recibirDamage(daño){
    this.vida -= daño;
    actualizarUi.vitBar(this)
  }

  cargar(){
    this.carga += this.vel;
  }

  resetearCarga(){
    this.carga = 0;
  }


}

const Terra = new Jugadores("Terra", "aliado", 200, 30, 28);

const Heartless = new Jugadores("Heartless", "enemigo", 100, 20, 21);

const Xehanort = new Jugadores("Xehanort", "enemigo", 100, 20, 22);


turnManager.agregar(Terra)
turnManager.agregar(Xehanort)
turnManager.agregar(Heartless)


function aver(personaje) {
  let grupo = null;

  if (personaje.grupo === "aliado") {
    grupo = turnManager.enemigosVivos;
  }

  else if (personaje.grupo === "enemigo") {
    grupo = turnManager.aliadosVivos;
  }

  return grupo;
}


async function esTurno(personaje) {

  const grupo = aver(personaje);

  let enemigo = null;

  if (personaje.grupo === "aliado") {

    enemigo = await menuPersonaje.uiSelector(grupo);
  }
  else {
    enemigo = Terra;
  }

  personaje.atacar(enemigo);
  turnManager.terminarTurno(personaje)
}

function comenzar() {
  pjInterface.renderAllPj();
  turnManager.cargarBarra();
}

comenzar();




export {esTurno, aver}