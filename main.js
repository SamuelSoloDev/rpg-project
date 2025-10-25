import menuPersonaje from "./UI/menuUi.js"
import {TurnManager, turnManagerActualContext} from './turnManager.js';
import {Screen, midGameScreen} from "./UI/pantalla.js";
import{pjInterface, actualizarUi, combatInterface} from './Jugadores/GameInterface.js';
import {Jugadores, NPC, ValentiaSignal} from './Jugadores/personaje.js'
import iaNpc from './Jugadores/IaNpc.js';
import { FABRICA } from "./Jugadores/fabrik.js";
import { MoldeHeroe} from "./Jugadores/heroes.js";
import { Molde } from "./Jugadores/enemigos.js";
import { COMPONENT_MANAGER } from "./UI/pjSelector.js";
import { Combate, Game } from "./game.js";
//Heroes
const heroes = ["Masamune", "Alblanc", "Kabuto", "Nicanora", "Raissa", "Alexandrius"]

//Funciones varias

function elementoAleatorio(array) {
  const indice = Math.floor(Math.random() * array.length);
  return array[indice];
}

function numeroAleatorio() {
  return Math.floor(Math.random() * 100) + 1;
}






/*function reiniciar(){
  turnManager.lista.forEach(jugador => {
    jugador.resetearEstado();
  });
  comenzar();
}*/

Game.Start();


export {  elementoAleatorio, heroes, numeroAleatorio}