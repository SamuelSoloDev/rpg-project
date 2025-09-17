import {
  CORAZA,
  FUERZA_FERREA,
  LLAMARADA_DEF,
  LLAMARADA_RES,
  POSTURA_DEFENSIVA_DEF,
  POSTURA_DEFENSIVA_RES,
  MODIFIER_MANAGER,
  PRISA,
  FRENO,
  VALENTIA,
  PROVOCAR_DEBUFF
} from './modifier.js';

import { PROVOCAR, QUEMADURA, SANGRADO } from "./status.js";

class Habilidad {
  constructor({
    nombre,
    efecto = () => { console.log("Wow, aquí no hay nada") },
    costo = 0,
    elemento = "fisico",
    escalado = 1,
    naturaleza = "defensivo",
    tipo = "habilidad",
    tipoDeDano = "fisico",
    rango = "unico",
    precision = 100,
    nivel = 1,
    probEfecto = 0,
  }) {
    this.nombre = nombre;
    this.efecto = efecto;
    this.costo = costo;
    this.tipoDeDano = tipoDeDano;
    this.elemento = elemento;
    this.escalado = escalado;
    this.naturaleza = naturaleza;
    this.tipo = tipo;
    this.rango = rango;
    this.precision = precision;
    this.nivel = nivel;
    this.probEfecto = probEfecto;
  }

  obtenerDescripcion() {
    return `${this.nombre} (${this.tipo}) cuesta ${this.costo} PM y tiene ${this.precision}% de acierto.`;
  }

  usar(usuario, objetivo) {
    this.consumirRecurso(usuario);
  console.log("[Habilidad.usar] ", this.nombre, { usuario, objetivo });
  usuario.actuar(objetivo, this.efecto, this.tipo);
}
  consumirRecurso(usuario){
    usuario.mana -= this.costo;
  }

}

const ataque = new Habilidad({
  nombre: "ataque",
  efecto: (usuario, objetivo) => {
    if (!objetivo || typeof objetivo.recibirDamage !== "function") {
      console.error("El objetivo no es válido o no tiene recibirDamage()", objetivo);
      return;
    }
    objetivo.recibirDamage(usuario.atq, usuario);
  },
  naturaleza: "ofensivo",
  tipo: "ataque",
});

const fireBall = new Habilidad({
  nombre: "Fire Ball",
  efecto: (usuario, objetivo) => {
    usuario.mana -= fireBall.costo;
    console.log(`${usuario.nombre} ha perdido ${fireBall.costo} de Mana`);
    let damage = usuario.magia * fireBall.escalado;
    objetivo.recibirDamage(damage, usuario);
    QUEMADURA.aplicarEstado(objetivo);
  },
  costo: 10,
  escalado: 1.5,
  tipo: "magia",
  naturaleza: "ofensivo"
});

const curar = new Habilidad({
  nombre: "curar",
  efecto: (usuario, objetivo) => {
    objetivo.vida += usuario.magia * curar.escalado;
    console.log(`${objetivo.nombre} se ha curado`);
  },
  escalado: 1,
  tipo: "magia",
  naturaleza: "defensivo",
  costo: 20,
});

const Provocar = new Habilidad({
  nombre: "provocar",
  efecto: (usuario, objetivo) => {
    PROVOCAR_DEBUFF.aplicarModificador(objetivo);
    PROVOCAR.aplicarEstado(objetivo);
  },
  naturaleza: "ofensivo",
  rango: "unico",
  tipo: "habilidad",
});

const Postura_Defensiva = new Habilidad({
  nombre: "Postura Defensiva",
  efecto: (usuario, objetivo) => {
    POSTURA_DEFENSIVA_DEF.aplicarModificador(usuario);
    POSTURA_DEFENSIVA_RES.aplicarModificador(usuario);
    console.log(`Las resistencias de ${usuario.nombre} han aumentado!`);
  },
  tipo: "habilidad",
  naturaleza: "defensivo",
  rango: "propio"
});

const llamarada = new Habilidad({
  nombre: "Llamarada",
  tipo: "magia",
  rango: "todos",
  naturaleza: "ofensivo",
  costo: 50,
  tipoDeDano: "magico",
  escalado: 1.5,
  efecto: (usuario, objetivo) => {
    objetivo.recibirDamage(usuario.totalMagia * llamarada.escalado, usuario);
    LLAMARADA_DEF.aplicarModificador(objetivo);
    LLAMARADA_RES.aplicarModificador(objetivo);
  }
});

const Espada_Del_Juicio = new Habilidad({
  nombre: "Espada del Juicio",
  tipo: "magia",
  rango: "unico",
  naturaleza: "ofensivo",
  costo: 150,
  tipoDeDano: "magico",
  escalado: 4,
  efecto: (usuario, objetivo) => {
    objetivo.recibirDamage(usuario.totalMagia * Espada_Del_Juicio.escalado, usuario);
  }
});

const signal_Contrafulgor = new Habilidad({
  nombre: "Contrafulgor",
  tipo: "habilidad",
  rango: "unico",
  naturaleza: "ofensivo",
  tipoDeDano: "magico",
  escalado: 0.7,
  efecto: (usuario, objetivo) => {
  console.log("[Contrafulgor.efecto]", { usuario, objetivo });
  if (!objetivo) {
    console.error("[Contrafulgor.efecto] ❌ Objetivo undefined");
    return;
  }

  let damage = usuario.totalMagia * 0.7;
  objetivo.recibirDamage(damage, usuario);
}

});

const mordisco = new Habilidad({
  nombre: "mordisco",
  efecto: (usuario, objetivo) => {
    if (!objetivo || typeof objetivo.recibirDamage !== "function") {
      console.error("El objetivo no es válido o no tiene recibirDamage()", objetivo);
      return;
    }
    objetivo.recibirDamage(usuario.totalAtq, usuario);
    SANGRADO.aplicarEstado(objetivo);
  },
  naturaleza: "ofensivo",
  tipo: "habilidad",
  rango: "unico",
  tipoDeDano: "fisico"
});

export {
  fireBall,
  ataque,
  curar,
  Provocar,
  llamarada,
  Espada_Del_Juicio,
  Postura_Defensiva,
  mordisco,
  signal_Contrafulgor
};
