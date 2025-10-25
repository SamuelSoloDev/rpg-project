import menuPersonaje from "./UI/menuUi.js"
import { COMPONENT_MANAGER } from "./UI/pjSelector.js";
import {TurnManager, turnManagerActualContext} from './turnManager.js';
import {Screen, midGameScreen, EndScreen} from "./UI/pantalla.js";
import{pjInterface, actualizarUi, combatInterface} from './Jugadores/GameInterface.js';
import {Jugadores, NPC, ValentiaSignal} from './Jugadores/personaje.js'
import iaNpc from './Jugadores/IaNpc.js';
import { CONGELAR, STATUS_MANAGER, VENENO } from "./buff_and_states/status.js";
import { MODIFIER_MANAGER, PRISA, FRENO } from "./buff_and_states/modifier.js";
import { FABRICA } from "./Jugadores/fabrik.js";
import { MoldeHeroe } from "./Jugadores/heroes.js";
import { Molde } from "./Jugadores/enemigos.js";
import { heroes } from "./main.js";
import { actionManager } from "./buff_and_states/gestorDeAccion.js";

const Game = {
  combate: null,
  heroes: [],
  estanciaBase: 1,
  async Start(){
    await Screen();
    let listaDeHeroes = await COMPONENT_MANAGER.renderizarMenuDeSeleccion();
    this.crearHeroes(listaDeHeroes);
    this.combatStart()
  },

  combatStart(){
    this.combate = new Combate({estancia: this.estanciaBase, heroes: this.heroes})
    console.log(this.heroes);

    this.combate.iniciarEstancia()
  },

  crearHeroes(lista){
    lista.forEach((h) => {
      const heroe = FABRICA.crearHeroe("Heroe", MoldeHeroe[h.nombre])
      this.heroes.push(heroe);
    })
  },

  Reset(){
    this.combate = null;
    this.heroes = null;
    this.Start();
  }
}


class Combate {
  constructor({
    estancia = 1,
    heroes,
    fabrica = FABRICA,
    moldes = Molde
  }) {
    this._estancia = estancia;
    this.heroes = heroes;     // lista de personajes aliados
    this.fabrica = fabrica;   // referencia a la fábrica de personajes
    this.moldes = moldes;     // referencia a los moldes de enemigos
    this.enemigos = null;
    this.turnManager = null;

    this.enemigosLista = {
      1: ["Lobo", "Saqueador"],
      2: ["Saqueador", "MagoOscuro"],
      3: ["MagoOscuro", "GuerreroOscuro"],
      4: ["VampiroDelVacio"]
    };
  }

  fabricarEnemigos(array) {
    this.enemigos = array.map((nombre) =>
      this.fabrica.crearHeroe("NPC", this.moldes[nombre])
    );
  }

  get estancia() {
    return this._estancia;
  }

  set estancia(valor) {
    if (valor < 1) this._estancia = 1;
    else if (valor > 5) this._estancia = 5;
    else this._estancia = valor;
  }

  iniciarEstancia() {
    console.log("######## ESTANCIA #############");
      console.log("######## ESTANCIA #############");
      console.log(`ESTANCIA: ${this.estancia}`);

    this.fabricarEnemigos(this.enemigosLista[this.estancia]);
    combatInterface.renderCombate();
    this.turnManager = new TurnManager({onBattleEnd: (ganador)=> this.finalizarEstancia(ganador)});
    console.log(this.turnManager);
    turnManagerActualContext.getContexTurnManager(this.turnManager);
    this.enemigos.forEach(e => {
      this.turnManager.agregar(e);
    });
    this.heroes.forEach(h => {
      this.turnManager.agregar(h)
    });
    actionManager.obtenerJugadores(this.heroes, this.enemigos)

    pjInterface.renderAllPj(this.heroes, this.enemigos);
    this.turnManager.cargarBarra();
  }

  async finalizarEstancia(ganador){
     console.log("⚔️ FINALIZAR ESTANCIA", ganador, "desde", this.estancia, "timestamp:", Date.now());
    if (ganador == "aliados") {
      this.estancia ++;
      if (this.estancia >= 5) {
        await EndScreen(ganador)
        Game.Reset();
        this.estancia = 1;
        return
      }
      await midGameScreen(this._estancia);
      console.log("YA TERMINÓ LA PANTALLA");

     // this.heroes.forEach(h =>{h.restaurarParaNuevoCombate()})
      this.iniciarEstancia();
      console.log("EMPIEZA DE NUEVO LA ESTANCIA");

    }
    else if (ganador == "enemigos") {
     await EndScreen(ganador);
      Game.Reset();
    }
  }
}

export {Combate, Game}