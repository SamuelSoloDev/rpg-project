import {Terra, elementoAleatorio} from './main.js';
import menuPersonaje from './menuUi.js';
import screen from "./pantalla.js";
import{pjInterface, actualizarUi} from './personajeInterface.js';
import actionManager from "./gestorDeAccion.js";
import {Jugadores, NPC} from './Jugadores/personaje.js'
import iaNpc from "./Jugadores/IaNpc.js";
import { ataque } from "./abilities.js";

const turnManager = {
  lista: [],

  turno: true,

  intervalId: null,

  get aliados() {
    return this.lista.filter(p => p.grupo === "aliado");
  },
  get enemigos() {
    return this.lista.filter(p => p.grupo === "enemigo");
  },

  get aliadosVivos(){
    return this.aliados.filter(p => p.vivo)
  },

  get enemigosVivos() {
    return this.enemigos.filter(p => p.vivo);
  },

  agregar(personaje) {
  if (personaje instanceof Jugadores) {
    this.lista.push(personaje);
  } else {
    console.warn("⚠️ TurnManager.agregar recibió un objeto no válido:", personaje);
  }
},

  cargarBarra() {
    if (this.turno) {
      this.intervalId = setInterval(() => {
        this.lista.forEach((personaje) => {
          if (personaje.vivo) {
            personaje.cargar();
            actualizarUi.chargeBar(personaje);
          }

          if (personaje.carga >= 100 && personaje.vivo) {
            this.empezarTurno(personaje)
          }
        });
      }, 500);
    }
  },

  detenerCarga() {
    this.turno = false;
    clearInterval(this.intervalId);
    this.intervalId = null;
  },

  reanudarCarga() {
    if (!this.turno) {
      this.turno = true;
      this.cargarBarra();
    }
  },

  verificarEstado(){
    console.log("verifico");

    const aliadosVivos = this.aliados.filter(p => p.vivo)
    const enemigosVivos = this.enemigos.filter(p => p.vivo)
    if (aliadosVivos.length === 0) {
      this.detenerCarga();
      console.log("Ganó el equipo enemigo")
      screen.reinicio();
    }
    else if (enemigosVivos.length === 0) {
      this.detenerCarga();
      console.log("Ganó el equipo aliado")
      screen.reinicio();
    }
  },

  async empezarTurno(personaje){
    this.detenerCarga();
    let accion = null;
    let objetivo = null;
    console.log(`Es turno de: ${personaje.nombre}`);


    if (personaje.grupo === "aliado") {

       accion = await menuPersonaje.uiPersonaje(personaje);
       console.log(accion);

       let posiblesObjetivos = actionManager.obtenerPosiblesObjetivos(personaje, accion);
       console.log(posiblesObjetivos);

       objetivo = await menuPersonaje.uiSelector(posiblesObjetivos);
      }
    else {
      let accionElegida = iaNpc.elegirAccion(personaje);
      accion = accionElegida.accion;
      let posiblesObjetivos = actionManager.obtenerPosiblesObjetivos(personaje, accion);
       console.log(posiblesObjetivos);
      objetivo = elementoAleatorio(posiblesObjetivos);
    }
    accion.usar(personaje, objetivo);
    this.terminarTurno(personaje);
  },

  terminarTurno(personaje){
    menuPersonaje.esperarTurno();
    personaje.resetearCarga()
    this.reanudarCarga();
  }
};

export default turnManager;


/*

 console.log("Personaje actual:", personaje);
console.log("Tiene cargar?:", typeof personaje.cargar);
          personaje.cargar(); // Suponemos que personaje tiene un mtodo cargar()
          console.log(`${personaje.nombre} carga: ${personaje.carga}`)
*/