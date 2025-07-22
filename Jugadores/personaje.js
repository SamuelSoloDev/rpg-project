import { ataque } from "../abilities";
class Jugadores {
  constructor({ nombre, grupo, vida, mana, atq, magia, vel }) {
    this.base = {
      nombre,
      grupo,
      vida,
      mana,
      atq,
      magia,
      vel,
    };

    this.nombre = nombre;
    this.grupo = grupo;
    this._vida = vida;
    this.mana = mana;
    this.atq = atq;
    this.magia = magia;
    this.vel = vel;
    this._vivo = this._vida > 0;
    this._carga = 0;
  }

  get vida() {
    return this._vida;
  }

  get vivo() {
    return this._vivo;
  }

  get carga() {
    return this._carga;
  }

  set vida(valor) {
    this._vida = valor;
    if (this._vida <= 0 && this._vivo) {
      this._vivo = false;
    }
    if (this._vida < 0) {
      this._vida = 0;
    }
  }

  set carga(valor) {
    this._carga = valor;
    if (this._carga > 100) {
      this._carga = 100;
    }
  }

  atacar(objetivo) {
    ataque(objetivo);
  }

  usarHechizo(hechizo, objetivo) {
    hechizo.usar(this, objetivo);
  }

  recibirDamage(daño) {
    this.vida -= daño;
    actualizarUi.vitBar(this);
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
  }

  ejecutarComportamiento(objetivo) {

  }
}

export {Jugadores, NPC}