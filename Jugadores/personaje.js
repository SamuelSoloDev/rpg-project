import { ataque, curar } from "../buff_and_states/abilities.js";
import turnManager from '../turnManager.js';
import{pjInterface, actualizarUi} from './personajeInterface.js';
import { VALENTIA } from "../buff_and_states/modifier.js";

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
      precision: [],
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
      precision: [],
      critRate: [],
      critDamage: []
    };
    this.signals = {
      onAttack: [],
      onTakeDamage: [],
      onTakeDamageFromEnemy:[],
      onCastSpell: [],
      onUseAbility: []
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
    this.precision = 100;
    this._vivo = this._vida > 0;
    this._carga = 0;
    this.critRate = 0;
    this.critDamage = 1.75;
    this.habilidades = null;
    this.magias = null;
  }

  get opciones() {
    return [
      { texto: "Atacar", valor: ataque },
      { texto: "Magia", subopciones: Object.values(this.magias) },
      {
        texto: "Habilidades",
        subopciones: Object.values(this.habilidades)
      }
    ];
  }

  get vida() { return this._vida; }
  get vivo() { return this._vivo; }

  set vida(valor) {
  // 🔹 Convertir a entero primero
  this._vida = Math.round(valor);

  if (this._vida <= 0 && this._vivo) this._vivo = false;
  if (this._vida < 0) this._vida = 0;
  if (this._vida > this.maxVida) {
    this._vida = this.maxVida;
  }
  actualizarUi.vitBar(this);
  turnManager.verificarEstado();
}

  //Getter de stats
  get maxVida() {return this.base.vida}
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

  actuar(objetivo, efecto, tipo) {
  console.log("[Heroe.actuar]", this.nombre, { objetivo, efecto, tipo });
  let acciones = {
    magia: (objetivo, efecto) => this.cast(objetivo, efecto),
    habilidad: (objetivo, efecto) => this.useAbility(objetivo, efecto),
    ataque: (objetivo, efecto) => this.atacar(objetivo, efecto)
  };

  if (!acciones[tipo]) {
    console.error("[Heroe.actuar] Tipo no válido:", tipo);
    return;
  }

  acciones[tipo](objetivo, efecto);
}


  atacar(enemigo){
    this.ejecutarSignal("onAttack", {usuario: this})
    enemigo.recibirDamage(this.totalAtq, this)
  }

  cast(objetivo, magia){
    this.ejecutarSignal("onCastSpell", {usuario: this})
      magia(this, objetivo);

  }

  useAbility(objetivo, habilidad) {
  console.log("[useAbility] usuario:", this.nombre, "objetivo:", objetivo, "habilidad:", habilidad);
  if (!objetivo) {
    console.error("[useAbility] ⚠️ Objetivo undefined", habilidad);
    return;
  }
    habilidad(this, objetivo)
}


  recibirDamage(daño, agresor) {
  if (this._estaContraAtacando) return;
  console.log("he sido dañado");


  this.vida -= daño;
  actualizarUi.vitBar(this);
  this._estaContraAtacando = true;
  this.ejecutarSignal("onTakeDamageFromEnemy", {usuario: this, objetivo: agresor});
  this.ejecutarSignal("onTakeDamage", {usuario: this});
  this._estaContraAtacando = false;
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

  aprenderHabilidades(listaHabilidades) {
    this.habilidades = listaHabilidades;
  }

  aprenderMagias(listaDeMagias) {
    this.magias = listaDeMagias;
  }

  ejecutarSignal(tipoSeñal, parametros){
    this.signals[tipoSeñal].forEach(signal => {
      signal.ejecutar(parametros);
    })
  }

  asignarSignal(tipoSeñal, señal){
    this.signals[tipoSeñal].push(señal);
  }
}


class NPC extends Jugadores {
  constructor({
    nombre,
    grupo,
    vida,
    mana,
    atq,
    def,
    magia,
    res,
    vel,
    monstruo,
    comportamiento
  }) {
    super({ nombre, grupo, vida, mana, atq, def, magia, res, vel });
    this.monstruo = monstruo;
    this.comportamiento = comportamiento;
    this.acciones = [
      { nombre: "atacar", accion: ataque },
      { nombre: "curar", accion: curar}
    ] // 👈 importante: se conserva
  }


}


class Heroe extends Jugadores {
  constructor({ nombre, grupo, vida, mana, atq, def, magia, res, vel, }) {
    super({ nombre, grupo, vida, mana, atq, def, magia, res, vel });
    this.habilidades = null;
    this.magias = null;
  }
}




const ValentiaSignal = {
  nombre: "valentia",
  ejecutar: function ({usuario}) {
      VALENTIA.aplicarModificador(usuario);
      console.log(`La magia de ${usuario.nombre} ha subido a ${usuario.totalMagia}`);

    }
}


export {Jugadores, NPC, ValentiaSignal, Heroe}
