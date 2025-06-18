import {aver, esTurno} from './main.js';
import menuPersonaje from './menuUi.js';
import{pjInterface, actualizarUi} from './personajeInterface.js';

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
    this.lista.push(personaje);
  },

  cargarBarra() {
    if (this.turno) {
      this.intervalId = setInterval(() => {
        this.verificarEstado();
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
    const aliadosVivos = this.aliados.filter(p => p.vivo)
    const enemigosVivos = this.enemigos.filter(p => p.vivo)
    if (aliadosVivos.length === 0) {
      this.detenerCarga();
      console.log("Ganó el equipo enemigo")
    }
    else if (enemigosVivos.length === 0) {
      this.detenerCarga();
      console.log("Ganó el equipo aliado")
    }
  },

  async empezarTurno(personaje){
    this.detenerCarga();
    esTurno(personaje)
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