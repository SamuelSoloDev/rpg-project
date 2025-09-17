import { elementoAleatorio} from './main.js';
import menuPersonaje from './UI/menuUi.js';
import screen from "./UI/pantalla.js";
import{pjInterface, actualizarUi} from './Jugadores/personajeInterface.js';
import actionManager from "./buff_and_states/gestorDeAccion.js";
import {Jugadores, NPC} from './Jugadores/personaje.js'
import iaNpc from "./Jugadores/IaNpc.js";
import { ataque } from "./buff_and_states/abilities.js";
import { STATUS_MANAGER } from "./buff_and_states/status.js";

const turnManager = {
  lista: [],

  turno: true,

  turnoEnCurso: false,

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
    this.lista.sort((a,b)=> b.vel - a.vel)
  } else {
    console.warn("⚠️ TurnManager.agregar recibió un objeto no válido:", personaje);
  }
},

  cargarBarra() {

    if (this.turno) {
      this.intervalId = setInterval(() => {
        this.lista.forEach((personaje) => {
          if (this.turnoEnCurso) return;

          if (personaje.vivo) {
            personaje.cargar();
            actualizarUi.chargeBar(personaje);
          }

          if (personaje.carga >= 100 && personaje.vivo) {
            this.turnoEnCurso = true;
            this.detenerCarga();

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
    STATUS_MANAGER.checkStatus(personaje, "inicio")
    let accion = null;
    let objetivo = null;
    console.log(`Es turno de: ${personaje.nombre}`);

    if (personaje.grupo === "aliado") {

       accion = await menuPersonaje.uiPersonaje(personaje);
       console.log(accion);

       if (accion.rango === "propio") {
        objetivo = personaje;
       }
       else {
        let posiblesObjetivos = actionManager.obtenerPosiblesObjetivos(personaje, accion);
       console.log(posiblesObjetivos);

       objetivo = await menuPersonaje.uiSelector(posiblesObjetivos);
       }

      }
    else {
      let accionElegida = iaNpc.elegirAccion(personaje);
      accion = accionElegida.accion;
      let posiblesObjetivos = actionManager.obtenerPosiblesObjetivos(personaje, accion);
       console.log(posiblesObjetivos);
      objetivo = elementoAleatorio(posiblesObjetivos);
    }

    accion.usar(personaje, objetivo);
    console.log("se ejecutó la acción");

    this.terminarTurno(personaje);
  },

  async terminarTurno(personaje){
    STATUS_MANAGER.checkStatus(personaje, "final")
    personaje.resetearCarga()
    console.log(personaje.carga);

    menuPersonaje.esperarTurno();
    this.turnoEnCurso = false;
    this.reanudarCarga();
  }
};

export default turnManager;


/*
dejame replantearte el problema, el orden va así
Player 1 (velocidad: 30),
player 2 (vel 28),
enemigo 1 (vel 20)
enemigo 2 (vel 22)

Los players ejecutan el render del menú cuando su turno llega (cuando la barra llega a 100)
Por alguna razón, por que la velocidad de los players es casi la misma
llega el turno del player 1, pero cómo la velocidad de player dos es casi igual, se renderiza el del player 2
imagino que es por que el player dos fue el último justo después del player 1
Cuando llega el turno de los players, las barra, efectivamente, dejan de cargar y el setInterval no está andando (cómo debe ser)
entonces, que debo hacer para que no se superponga el turno del otro JUGADOR? (los enemigos no se superponen, ya que el problema se encuentra en lso players)

*/