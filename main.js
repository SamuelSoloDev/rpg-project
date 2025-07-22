import menuPersonaje from "./menuUi.js"
import turnManager from './turnManager.js';
import screen from "./pantalla.js";
import{pjInterface, actualizarUi} from './personajeInterface.js';
import {Jugadores, NPC} from './Jugadores/personaje.js'


const Terra = new Jugadores({
  nombre: "Terra",
  grupo: "aliado",
  vida: 200,
  mana: 100,
  atq: 30,
  magia: 20,
  vel: 28});

const Heartless = new NPC({
  nombre: "Heartless",
  grupo: "enemigo",
  vida: 0,
  mana: 50,
  atq: 20,
  magia: 30,
  vel: 21});

const Xehanort = new NPC(
  {nombre: "Xehanort",
   grupo: "enemigo",
   vida: 0,
   mana: 50,
   magia: 50,
   atq: 20,
   vel: 22});


turnManager.agregar(Terra)
turnManager.agregar(Xehanort)
turnManager.agregar(Heartless)




async function esTurno(personaje) {
   //Por ahora, esta función hace lo siguiente: 1) primero revisa el grupo,
   // luego revisa quién es el objetivo, pero no lo hace bien.
   // Puesto que hace un if que dice que si el grupo del que tiene el turno es de los jugadores
   // entonces


  personaje.atacar(enemigo);
  turnManager.terminarTurno(personaje)
}

function comenzar() {
  pjInterface.renderAllPj();
  turnManager.cargarBarra();
}

function reiniciar(){
  turnManager.lista.forEach(jugador => {
    jugador.resetearEstado();
  });
}

screen.inicio();




export {esTurno, Jugadores, comenzar, reiniciar}