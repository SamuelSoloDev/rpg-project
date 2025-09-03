import menuPersonaje from "./menuUi.js"
import turnManager from './turnManager.js';
import screen from "./pantalla.js";
import{pjInterface, actualizarUi} from './personajeInterface.js';
import {Jugadores, NPC} from './Jugadores/personaje.js'
import iaNpc from './Jugadores/IaNpc.js';
import { CONGELAR, STATUS_MANAGER, VENENO } from "./buff_and_states/status.js";
import { MODIFIER_MANAGER, PRISA, FRENO } from "./buff_and_states/modifier.js";



//Heroes
const heroes = ["Masamune", "Alblanc", "Kabuto", "Nicanora", "Raissa", "Alexandrius"]

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
  atq: 130,
  magia: 20,
  vel: 30});

const Sora = new Jugadores({
  nombre: "Sora",
  grupo: "aliado",
  vida: 120,
  mana: 50,
  atq: 130,
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
  turnManager.lista.forEach(jugador => {
   console.log( jugador.vida);

  });
}

function reiniciar(){
  turnManager.lista.forEach(jugador => {
    jugador.resetearEstado();
  });
  comenzar();
}

PRISA.aplicarModificador(Terra);
FRENO.aplicarModificador(Terra);
let array = []

console.log(array.length);


//MODIFIER_MANAGER._buscarBuff(Terra);


 //tratando de ponerlo a prueba
/*CONGELAR.aplicarEstado(Terra);
VENENO.aplicarEstado(Terra);

STATUS_MANAGER.checkStatus(Terra, "final");
STATUS_MANAGER.checkStatus(Terra, "final");
STATUS_MANAGER.checkStatus(Terra, "final"); */

export { comenzar, reiniciar, Terra, elementoAleatorio, heroes}