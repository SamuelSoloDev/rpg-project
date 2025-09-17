import menuPersonaje from "./UI/menuUi.js"
import turnManager from './turnManager.js';
import screen from "./UI/pantalla.js";
import{pjInterface, actualizarUi} from './Jugadores/personajeInterface.js';
import {Jugadores, NPC, ValentiaSignal} from './Jugadores/personaje.js'
import iaNpc from './Jugadores/IaNpc.js';
import { CONGELAR, STATUS_MANAGER, VENENO } from "./buff_and_states/status.js";
import { MODIFIER_MANAGER, PRISA, FRENO } from "./buff_and_states/modifier.js";
import { FABRICA } from "./Jugadores/fabrik.js";
import { MoldeAlexandrius } from "./Jugadores/heroes.js";


//Heroes
const heroes = ["Masamune", "Alblanc", "Kabuto", "Nicanora", "Raissa", "Alexandrius"]

//Funciones varias

function elementoAleatorio(array) {
  const indice = Math.floor(Math.random() * array.length);
  return array[indice];
}

const Alexandrius = FABRICA.crearHeroe("Heroe", MoldeAlexandrius)




const Heartless = new NPC({
  nombre: "Heartless",
  grupo: "enemigo",
  vida: 100,
  mana: 50,
  atq: 20,
  magia: 30,
  vel: 24,
  comportamiento: "fulminador"
});

const Xehanort = new NPC(
  {nombre: "Xehanort",
   grupo: "enemigo",
   vida: 100,
   mana: 50,
   magia: 50,
   atq: 20,
   vel: 27,
   comportamiento: "fulminador"
  });





turnManager.agregar(Alexandrius)
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

comenzar();


 //tratando de ponerlo a prueba
/*CONGELAR.aplicarEstado(Terra);
VENENO.aplicarEstado(Terra);

STATUS_MANAGER.checkStatus(Terra, "final");
STATUS_MANAGER.checkStatus(Terra, "final");
STATUS_MANAGER.checkStatus(Terra, "final"); */

export { comenzar, reiniciar, elementoAleatorio, heroes}