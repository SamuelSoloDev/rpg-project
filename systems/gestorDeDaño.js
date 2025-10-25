import { numeroAleatorio } from "../main.js";

const DAMAGE_MANAGER = {
  afectado: null,
  damage: null,       // daño base de la habilidad
  tipoDamage: null,   // "fisico" o "magico"
  atacante: null,
  esCritico: false,   // <<--- NUEVO ATRIBUTO
  K: 50,

  procesarDaño({ atacante, damage, tipoDamage, afectado, esCritico = false }) {
    if (esCritico == null || esCritico == undefined) {
      esCritico = false;
    }
    this._agregarDatosHabilidades({
      atacante,
      damage,
      tipoDamage,
      afectado,
      esCritico
    });

    return this._calcularDaño();
  },

  procesarDañoEstado({damage, tipoDamage, afectado}){
    let ataque = 0;
    let defensa = 0;

    // Según el tipo de daño, usamos stats distintos
    if (tipoDamage === "fisico") {
      ataque = damage;
      defensa = afectado.def;
    }
    else if (tipoDamage === "magico") {
      ataque = damage;
      defensa = afectado.res;
    }
    else {
      console.warn(`Tipo de daño no reconocido: ${tipoDamage}`);
      return 0;
    }

    // Fórmula básica
    let dañoReal = (ataque * this.K) / (defensa + this.K);

    let dañoEntero = Math.floor(dañoReal);
    return Math.max(1, dañoEntero);
  },

  _agregarDatosHabilidades({ atacante, damage, tipoDamage, afectado, esCritico }) {
    this.afectado = afectado;
    this.damage = damage;
    this.tipoDamage = tipoDamage;
    this.atacante = atacante;
    this.esCritico = esCritico; // <<--- guardamos si la habilidad fuerza crítico
  },

  _calcularDaño() {
    let ataque = 0;
    let defensa = 0;

    // Según el tipo de daño, usamos stats distintos
    if (this.tipoDamage === "fisico") {
      ataque = this.damage;
      defensa = this.afectado.def;
    }
    else if (this.tipoDamage === "magico") {
      ataque = this.atacante.magia + this.damage;
      defensa = this.afectado.res;
    }
    else {
      console.warn(`Tipo de daño no reconocido: ${this.tipoDamage}`);
      return 0;
    }

    // Fórmula básica
    let dañoReal = (ataque * this.K) / (defensa + this.K);

    // Golpe crítico
    let esCriticoFinal = false;
    if (this.esCritico === true) {
      // Fuerza crítico
      dañoReal *= this.atacante.totalCritDamage;
      esCriticoFinal = true;
    } else {
      // Comportamiento normal
      const numeroAleatorio = Math.random(); // entre 0 y 1
      if (numeroAleatorio < this.atacante.totalCritRate / 100) {
        dañoReal *= this.atacante.totalCritDamage;
        esCriticoFinal = true;
      }
    }

    // Si fue crítico, lanzamos señal
    if (esCriticoFinal) {
      this.atacante.ejecutarSignal("onCriticalHit", {
        usuario: this.atacante,
        objetivo: this.afectado,
        dañoFinal: Math.floor(dañoReal)
      });
    }

    // Redondeo y mínimo 1 de daño
    let dañoEntero = Math.floor(dañoReal);
    return Math.max(1, dañoEntero);
  }
};



export {DAMAGE_MANAGER}