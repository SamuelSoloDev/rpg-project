import menuPersonaje from "./menuUi.js"
import turnManager from './turnManager.js';
import screen from "./pantalla.js";
import{pjInterface, actualizarUi} from './personajeInterface.js';
import {Jugadores, NPC} from './Jugadores/personaje.js'
import iaNpc from './Jugadores/IaNpc.js';

//Funciones varias

function elementoAleatorio(array) {
  const indice = Math.floor(Math.random() * array.length);
  return array[indice];
}


const Terra = new Jugadores({
  nombre: "Terra",
  grupo: "aliado",
  vida: 130,
  mana: 100,
  atq: 30,
  magia: 20,
  vel: 28});

const Sora = new Jugadores({
  nombre: "Sora",
  grupo: "aliado",
  vida: 120,
  mana: 50,
  atq: 30,
  magia: 20,
  vel: 30
})

const Heartless = new NPC({
  nombre: "Heartless",
  grupo: "enemigo",
  vida: 100,
  mana: 50,
  atq: 20,
  magia: 30,
  vel: 21,
  comportamiento: "fulminador"
});

const Xehanort = new NPC(
  {nombre: "Xehanort",
   grupo: "enemigo",
   vida: 100,
   mana: 50,
   magia: 50,
   atq: 20,
   vel: 22,
   comportamiento: "fulminador"
  });





turnManager.agregar(Terra)
turnManager.agregar(Sora)
turnManager.agregar(Xehanort)
turnManager.agregar(Heartless)



function comenzar() {
  pjInterface.renderAllPj();
  turnManager.cargarBarra();
}

function reiniciar(){
  turnManager.lista.forEach(jugador => {
    jugador.resetearEstado();
  });
  turnManager.cargarBarra();
}


comenzar();


export { comenzar, reiniciar, Terra, elementoAleatorio}