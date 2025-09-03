import { ataque, curar } from "../abilities.js";
import turnManager from '../turnManager.js';
import{pjInterface, actualizarUi} from '../personajeInterface.js';

class Jugadores {
  constructor({ nombre, grupo, vida, mana, atq, def, magia, res, vel }) {
    this.base = {
      nombre,
      grupo,
      vida,
      mana,
      atq,
      def: 5,
      magia,
      res: 5,
      vel
    };

    this.buff = {
      vida: [],
      mana: [],
      atq: [],
      def: [],
      magia: [],
      res: [],
      vel: [],
      critRate: [],
      critDamage: []
    };

    this.debuff = {
      vida: [],
      mana: [],
      atq: [],
      def: [],
      magia: [],
      res: [],
      vel: [],
      critRate: [],
      critDamage: []
    };
    this.signals = {
      onAttack: [],
      onTakeDamage: [],
      onCastSpell: [],
      onUseAbilitie: []
    }
    this.status = {};
    this.nombre = nombre;
    this.grupo = grupo;
    this._vida = vida;
    this.mana = mana;
    this.atq = atq;
    this.def = def;
    this.magia = magia;
    this.res = res;
    this.vel = vel;
    this._vivo = this._vida > 0;
    this._carga = 0;
    this.critRate = 0;
    this.critDamage = 1.75;

    this.magias = {
      fuego: { texto: "Fuego", valor: "magia_fuego" },
      hielo: { texto: "Hielo", valor: "magia_hielo" },
      trueno: { texto: "Trueno", valor: "magia_trueno" }
    };
  }

  get opciones() {
    return [
      { texto: "Atacar", valor: ataque },
      { texto: "Magia", subopciones: Object.values(this.magias) },
      {
        texto: "Objeto",
        subopciones: [
          { texto: "Poción", valor: "usar_pocion" },
          { texto: "Éter", valor: "usar_eter" }
        ]
      }
    ];
  }

  get vida() { return this._vida; }
  get vivo() { return this._vivo; }

  set vida(valor) {
    this._vida = valor;
    if (this._vida <= 0 && this._vivo) this._vivo = false;
    if (this._vida < 0) this._vida = 0;
    actualizarUi.vitBar(this);
    turnManager.verificarEstado();
  }

  //Getter de stats
  get totalAtq() { return this.statTotal("atq"); }
  get totalDef() { return this.statTotal("def"); }
  get totalMagia() { return this.statTotal("magia"); }
  get totalRes() { return this.statTotal("res"); }
  get totalVel() { return this.statTotal("vel"); }

  get carga() { return this._carga; }
  set carga(valor) {
    this._carga = valor;
    if (this._carga > 100) this._carga = 100;
  }

  recibirDamage(daño) {

    this.vida -= daño;
  }

  cargar() {
    this.carga += this.vel;
  }

  resetearCarga() {
    this.carga = 0;
  }

  resetearEstado() {
    this._vida = this.base.vida;
    this.mana = this.base.mana;
    this.atq = this.base.atq;
    this.magia = this.base.magia;
    this.vel = this.base.vel;
    this._vivo = true;
    this._carga = 0;
  }

  statMod(array) {
    let modificadores = [];
    array.forEach(modificador => {
      modificadores.push(modificador.valorEfecto);
    });
    return modificadores;
  }

  statTotal(stat) {
    let buff = 0;
    let debuff = 0;
    let total = 0;

    this.statMod(this.buff[stat]).forEach(valores => {
      let valor = this[stat] * valores;
      buff += valor;
    });

    this.statMod(this.debuff[stat]).forEach(valores => {
      let valor = this[stat] * valores;
      debuff += valor;
    });

    total = this[stat] + buff - debuff;
    return total;
  }

  asignarSignal(tipoSeñal, señal){
    this.tipoSeñal
  }
}



class NPC extends Jugadores {
  constructor({
    nombre,
    grupo,
    vida,
    mana,
    atq,
    magia,
    vel,
    comportamiento = "aleatorio" }) {
    super({ nombre, grupo, vida, mana, atq, magia, vel });
    this.comportamiento = comportamiento; // puede ser una función o una cadena que indique qué hacer
    this.acciones = [
      { nombre: "atacar", accion: ataque },
      { nombre: "curar", accion: curar}
    ];
  }
}

class Heroe extends Jugadores {
  constructor({
    heroe
  }){
  super({nombre, grupo, vida, mana, atq, def, magia, res, vel});
  this.heroe = heroe;
  this.habilidades = null;
  this.magias = null;
  }
  aprenderHabilidades(listaHabilidades){

  }

  aprenderMagias(listaDeMagias){

  }
}


const Alexandrius = {
  nombre: "Alexandrius Ingmar Sepulcri",
  grupo: "aliado",
  vida: 120,
  mana: 100,
  atq: 24,
  def: 40,
  magia: 28,
  res: 23,
  vel: 9,
  habilidades: {

  },
  magias: {

  },
  signals: {
    nombre: "valentia",
    efecto: () => {}
  }
}



export {Jugadores, NPC}