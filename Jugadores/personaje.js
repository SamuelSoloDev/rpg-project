import { ataque, curar, recargarMana } from "../buff_and_states/abilities.js";
import {TurnManager, turnManagerActualContext} from '../turnManager.js';
import{pjInterface, actualizarUi} from './GameInterface.js';
import { VALENTIA } from "../buff_and_states/modifier.js";
import { señalCritico } from "../Jugadores/heroes.js";
import { DAMAGE_MANAGER } from "../systems/gestorDeDaño.js";


class Jugadores {
  constructor({
    nombre,
    grupo,
    vida = 40,
    mana,
    regeneracionDeMana = 10,
    atq,
    def = 10,
    magia,
    res = 10,
    vel,
    critRate = 15,
    critDamage = 1.75,
    malicia = 0,
  }) {
    this.base = {
      nombre,
      grupo,
      vida,
      mana,
      regeneracionDeMana,
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
      onTakeDamage: [actualizarUi.signalAnimarDamage],
      onTakeDamageFromEnemy:[],
      onVidaChange:[actualizarUi.signalActualizarVida],
      onEscudoChange:[actualizarUi.signalActualizarEscudo],
      onCastSpell: [],
      onUseAbility: [],
      onCriticalHit: [señalCritico],
      onDeath:[]
    }
    this.status = {};
    this.nombre = nombre;
    this.grupo = grupo;
    this._vida = vida;
    this._mana = mana;
    this.regeneracionDeMana = regeneracionDeMana;
    this.atq = atq;
    this.def = def;
    this.magia = magia;
    this.res = res;
    this.vel = vel;
    this.precision = 100;
    this._vivo = this._vida > 0;
    this._carga = 0;
    this.critRate = critRate
    this.critDamage = critDamage
    this.habilidades = null;
    this.magias = null;
    this.malicia = malicia;
    this._escudo = 0;
    this.sprite = `${this.nombre}.png`
    this._estaContraAtacando = false;
    this._ataqueDoble = false;
    this.saltarTurno = false;
  }

  get opciones() {
    return [
      { texto: "Atacar", valor: ataque },
      { texto: "Magia", subopciones: Object.values(this.magias) },
      {
        texto: "Habilidades",
        subopciones: Object.values(this.habilidades)
      },
      { texto: "Recargar", valor: recargarMana}
    ];
  }

  get vida() { return this._vida; }
  get vivo() { return this._vivo; }
  get mana() { return this._mana; }
  get escudo() {return this._escudo}
  set vida(valor) {
  this._vida = Math.round(valor);
  if (this._vida < 0) this._vida = 0;
  if (this._vida > this.maxVida) this._vida = this.maxVida;

  this.ejecutarSignal("onVidaChange", { usuario: this });

  // 🔹 Detectar "muerte" potencial
  if (this._vida <= 0 && this._vivo) {
    this.ejecutarSignal("onDeath", { usuario: this });

    // 🔹 Si el evento "onDeath" devuelve algo que indica que resucita, no marcarlo como muerto
    if (this._vida <= 0 && this._vivo) {
      this._vivo = false;
    }
  }

  turnManagerActualContext.Actual.verificarEstado();
}

 set mana(valor){
  this._mana = Math.round(valor);
  if (this._mana < 0) {
    this._mana = 0;
  };
  if (this._mana > this.base.mana) {
    this._mana = this.base.mana;
  }
 }

 set escudo(valor){
  this._escudo = Math.round(valor);
  this.ejecutarSignal("onEscudoChange", {usuario: this});
 }
  //Getter de stats
  get maxVida() {return this.base.vida}
  get totalAtq() { return this.statTotal("atq"); }
  get totalDef() { return this.statTotal("def"); }
  get totalMagia() { return this.statTotal("magia"); }
  get totalRes() { return this.statTotal("res"); }
  get totalVel() { return this.statTotal("vel"); }
  get totalCritRate(){return this.statTotal("critRate")}
  get totalCritDamage(){return this.statTotal("critDamage")}

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
    enemigo.recibirDamageFisico(this.totalAtq, this)
    this.ejecutarSignal("onAttack", {usuario: this, objetivo: enemigo})
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


  recibirDamageFisico(daño, agresor, esCritico) {
    let dañoRestante = DAMAGE_MANAGER.procesarDaño({
      atacante: agresor,
      damage: daño,
      tipoDamage: "fisico",
      afectado: this,
      esCritico: esCritico
    });

    if (this.escudo > 0) {
      let dañoAbsorbido = Math.min(this.escudo, dañoRestante);
      this.escudo -= dañoAbsorbido;
      dañoRestante -= dañoAbsorbido;
    }

    if (this._estaContraAtacando) return;
    console.log(`Soy ${this.nombre} y ahora tengo ${this.vida} de vida`);

    if (dañoRestante > 0) {
      this.vida = Math.max(0, this.vida - dañoRestante);
    }
    this._estaContraAtacando = true;
    this.ejecutarSignal("onTakeDamageFromEnemy", {usuario: this, objetivo: agresor});
    this.ejecutarSignal("onTakeDamage", {usuario: this, daño: dañoRestante});
    this._estaContraAtacando = false;

    return dañoRestante;
}

recibirDamageFisicoEstado(daño) {
    let dañoRestante = DAMAGE_MANAGER.procesarDañoEstado({
      damage: daño,
      tipoDamage: "fisico",
      afectado: this,
    });

    if (this.escudo > 0) {
      let dañoAbsorbido = Math.min(this.escudo, dañoRestante);
      this.escudo -= dañoAbsorbido;
      dañoRestante -= dañoAbsorbido;
    }


    if (dañoRestante > 0) {
      this.vida = Math.max(0, this.vida - dañoRestante);
    }
    this.ejecutarSignal("onTakeDamage", {usuario: this, daño: dañoRestante});

    return dañoRestante;
}

recibirDamageMagicoEstado(daño) {
    let dañoRestante = DAMAGE_MANAGER.procesarDañoEstado({
      damage: daño,
      tipoDamage: "magico",
      afectado: this,
    });

    if (this.escudo > 0) {
      let dañoAbsorbido = Math.min(this.escudo, dañoRestante);
      this.escudo -= dañoAbsorbido;
      dañoRestante -= dañoAbsorbido;
    }


    if (dañoRestante > 0) {
      this.vida = Math.max(0, this.vida - dañoRestante);
    }
this.ejecutarSignal("onTakeDamage", {usuario: this, daño: dañoRestante});
    return dañoRestante;
}
 recibirDamageMagico(daño){
  let dañoRestante = DAMAGE_MANAGER.procesarDañoEstado({
      damage: daño,
      tipoDamage: "magico",
      afectado: this,
    });

  if (this.escudo > 0) {
      let dañoAbsorbido = Math.min(this.escudo, dañoRestante);
      this.escudo -= dañoAbsorbido;
      dañoRestante -= dañoAbsorbido;
    }
  if (dañoRestante > 0) {
      this.vida = Math.max(0, this.vida - dañoRestante);
    }
this.ejecutarSignal("onTakeDamage", {usuario: this, daño: dañoRestante});
  return dañoRestante;
 }

 curar(curacion){
  this.vida += curacion;
}

ganarEscudo(escudo){
  this.escudo += escudo;
}
 manaRestaurar(mana){
  if(mana > 0){
    this.mana += mana;
  }
  else {
    this.mana += this.regeneracionDeMana;
  }
  console.log(`el mana de ${this.nombre} es de ${this.mana}`);

 }

 //este método sólo existe para aspir
 perderMana(valor){
  let valorADevolver = Math.min(valor, this.mana)
  this.mana -= valor;
  return valorADevolver;
 }


  cargar() {
    this.carga += this.totalVel;
  }

  resetearCarga() {
    this.carga = 0;
  }

  restaurarParaNuevoCombate() {
  // Restaurar atributos básicos
  this._vida = this.base.vida;
  this._mana = this.base.mana;
  this._escudo = 0;
  this._vivo = true;
  this._carga = 0;

  // Limpiar efectos temporales
  for (let stat in this.buff) {
    this.buff[stat] = [];
  }
  for (let stat in this.debuff) {
    this.debuff[stat] = [];
  }
  this.status = {};

  // Reiniciar banderas internas
  this._estaContraAtacando = false;
  this._ataqueDoble = false;

  // Actualizar UI inmediatamente si corresponde
  this.ejecutarSignal("onVidaChange", { usuario: this });
  this.ejecutarSignal("onEscudoChange", { usuario: this });

  console.log(`✅ ${this.nombre} ha sido restaurado para el nuevo combate.`);
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
    vida = 10,
    mana,
    regeneracionDeMana = 50,
    atq,
    def,
    magia,
    res,
    vel,
    monstruo,
    comportamiento,
    //acciones = [  { nombre: "atacar", accion: ataque }, { nombre: "curar", accion: curar}]
  }) {
    super({ nombre, grupo, vida, mana, atq, def, magia, res, vel, regeneracionDeMana });
    this.monstruo = monstruo;
    this.comportamiento = comportamiento;
    this.acciones = null // 👈 importante: se conserva
    this.signals.onSecondFase = [];

  }
  aprenderAcciones(listaAcciones){
    this.acciones = listaAcciones;
  }

  activarSegundaFase(){
    this.ejecutarSignal("onSecondFase", {usuario: this});

  }

}


class Heroe extends Jugadores {
  constructor({ nombre,
    grupo,
    vida,
    mana,
    regeneracionDeMana = 10,
    atq,
    def = 10,
    magia,
    res = 10,
    vel,
    critRate = 15,
    critDamage = 1.75,
    malicia = 0,
     }) {
    super({ nombre, grupo, vida, mana, atq, def,
      magia, res, vel, malicia, critRate, critDamage, regeneracionDeMana});
    this.habilidades = null;
    this.magias = null;
  }
}


class Boss extends NPC {
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
    comportamiento,
    //acciones = [  { nombre: "atacar", accion: ataque }, { nombre: "curar", accion: curar}]
  }) {
    super({ nombre, grupo, vida, mana, atq, def, magia, res, vel });
    this.monstruo = monstruo;
    this.comportamiento = comportamiento;
    this.acciones = null; // 👈 importante: se conserva
    this.signals.onSecondFase = [];
  }
  aprenderAcciones(listaAcciones){
    this.acciones = listaAcciones;
  }
  activarSegundaFase(){
    this.ejecutarSignal("onSecondFase", {usuario: this})
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
