import { elementoAleatorio} from './main.js';
import menuPersonaje from './UI/menuUi.js';
import{pjInterface, actualizarUi} from './Jugadores/GameInterface.js';
import {actionManager} from "./buff_and_states/gestorDeAccion.js";
import {Jugadores, NPC} from './Jugadores/personaje.js'
import iaNpc from "./Jugadores/IaNpc.js";
import { ataque } from "./buff_and_states/abilities.js";
import { STATUS_MANAGER } from "./buff_and_states/status.js";


const turnManagerActualContext = {
  _Actual: null,
  get Actual(){return this._Actual},

  set Actual(valor){
    this._Actual = valor;
  },
  getContexTurnManager(turnManager){
    this.Actual = turnManager;
    console.log(this.Actual);

  }
}
class TurnManager {
  constructor({ onBattleEnd } = {}) {
    this.lista = [];
    this.turno = true;
    this.turnoEnCurso = false;
    this.intervalId = null;
    this.onBattleEnd = onBattleEnd;
    this.batallaTerminada = false;
  }

  get aliados() {
    return this.lista.filter(p => p.grupo === "aliado");
  }

  get enemigos() {
    return this.lista.filter(p => p.grupo === "enemigo");
  }

  get aliadosVivos() {
    return this.aliados.filter(p => p.vivo);
  }

  get enemigosVivos() {
    return this.enemigos.filter(p => p.vivo);
  }

  agregar(personaje) {
    if (personaje instanceof Jugadores) {
      this.lista.push(personaje);
      this.lista.sort((a, b) => b.vel - a.vel);
    } else {
      console.warn("⚠️ TurnManager.agregar recibió un objeto no válido:", personaje);
    }
  }

  cargarBarra() {
    if (this.turno && !this.batallaTerminada) {
      this.intervalId = setInterval(() => {
        this.lista.forEach(personaje => {
          if (this.turnoEnCurso || this.batallaTerminada) return;

          if (personaje.vivo) {
            personaje.cargar();
            actualizarUi.chargeBar(personaje);
          }

          if (personaje.carga >= 100 && personaje.vivo) {
            this.turnoEnCurso = true;
            this.detenerCarga();
            this.empezarTurno(personaje);
          }
        });
      }, 500);
    }
  }

  detenerCarga() {
    this.turno = false;
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  reanudarCarga() {
    if (!this.turno && !this.batallaTerminada) {
      this.turno = true;
      this.cargarBarra();
    }
  }

  verificarEstado() {
    let ganador = null;

    const aliadosVivos = this.aliadosVivos;
    const enemigosVivos = this.enemigosVivos;

    if (aliadosVivos.length === 0) {
      ganador = "enemigos";
      console.log("🏴‍☠️ Ganó el equipo enemigo");
    } else if (enemigosVivos.length === 0) {
      ganador = "aliados";
      console.log("🛡️ Ganó el equipo aliado");
    }

    // 🔹 Si ya hay un ganador, finaliza el combate
    if (ganador && !this.batallaTerminada) {
      setTimeout(() => {
      this.finalizarCombate(ganador);
    }, 1000);
    }

    return ganador;
  }

  async empezarTurno(personaje) {
     if (this.batallaTerminada) return;
     STATUS_MANAGER.checkStatus(personaje, "inicio");

  // Si el personaje está bloqueado por estado, salta el turno sin ejecutar acciones
  if (personaje.saltarTurno) {
    console.log(`${personaje.nombre} está incapacitado y pierde su turno.`);
    personaje.saltarTurno = false; // se limpia para el próximo turno
    this.terminarTurno(personaje);
    return;
  }


    personaje.manaRestaurar();


    let accion = null;
    let objetivo = [];

    console.log(`Es turno de: ${personaje.nombre}`);

    if (personaje.grupo === "aliado") {
      accion = await menuPersonaje.uiPersonaje(personaje);
      if (accion.rango === "propio") {
        objetivo.push(personaje);
      } else if (accion.rango === "todos") {
        objetivo = this.enemigosVivos;
      } else {
        const posiblesObjetivos = actionManager.obtenerPosiblesObjetivos(personaje, accion);
        const objetivoElegido = await menuPersonaje.uiSelector(posiblesObjetivos);
        objetivo.push(objetivoElegido);
      }

    } else {
      const accionElegida = iaNpc.elegirAccion(personaje);
      accion = accionElegida.accion;
      const posiblesObjetivos = actionManager.obtenerPosiblesObjetivos(personaje, accion);
      const objetivoElegido = elementoAleatorio(posiblesObjetivos);
      objetivo.push(objetivoElegido);
    }

    objetivo.forEach(obj => accion.usar(personaje, obj));
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.terminarTurno(personaje);
  }

  async terminarTurno(personaje) {
    personaje.resetearCarga();
    menuPersonaje.esperarTurno();
    this.turnoEnCurso = false;

    if (!this.verificarEstado()) {
      this.reanudarCarga();
    }

    STATUS_MANAGER.checkStatus(personaje, "final");
  }

  // 🔹 NUEVO MÉTODO: detiene TODO el flujo del combate
  finalizarCombate(ganador) {
    this.detenerCarga();
    this.turno = false;
    this.turnoEnCurso = false;
    this.batallaTerminada = true;

    // Limpieza extra (opcional)
    this.lista.forEach(p => p.carga = 0);

    console.log(`⚔️ Combate finalizado. Ganador: ${ganador}`);

    // Ejecutar callback si fue definida
    if (typeof this.onBattleEnd === "function") {
      this.onBattleEnd(ganador);
    }
  }
}



export {TurnManager, turnManagerActualContext}
