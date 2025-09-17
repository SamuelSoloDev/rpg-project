import { Heroe, ValentiaSignal } from "./personaje.js";
import {
  fireBall,
  ataque,
  curar,
  Provocar,
  llamarada,
  Espada_Del_Juicio,
  Postura_Defensiva,
  mordisco,
  signal_Contrafulgor
  } from "../buff_and_states/abilities.js";
import { Signal } from "./signals.js";
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
 } from "../buff_and_states/modifier.js";


 //señales por ahora
 const ValentiaOnDamage = new Signal({
    nombre: "valentiaOnTakeDamage",
    ejecutar: function ({usuario}) {
      VALENTIA.aplicarModificador(usuario);
       alert(`${usuario.nombre} recibió daño`)
    },
    statsPropios: null,
    tipoSeñal: "onTakeDamage"
    });
 const  ValentiaOnCast = new Signal ({
      nombre: "valentiaOnCast",
      ejecutar: function ({usuario}) {
        MODIFIER_MANAGER.reducirModifier(usuario, "buff", "onCastSpell")
        alert(`${usuario.nombre} hizo un hechizo`)

      },
      statsPropios: null,
      tipoSeñal: "onCastSpell"
    });
 const Contrafulgor = new Signal({
      nombre: "Contrafulgor",
      ejecutar: function ({usuario, objetivo}) {
        signal_Contrafulgor.usar(usuario, objetivo);
      },
      tipoSeñal: "onTakeDamageFromEnemy"
    });
  const señalDeataque = new Signal({
    nombre: "señalAtaque",
      ejecutar: function ({usuario}) {
       alert(`${usuario.nombre} hizo daño`)
      },
      tipoSeñal: "onAttack"
  })

const MoldeAlexandrius = {
  nombre: "Alexandrius",
  grupo: "aliado",
  vida: 150,
  mana: 200,
  atq: 24,
  def: 40,
  magia: 28,
  res: 23,
  vel: 30,
  heroe: "Alexandrius",
  habilidades: {
    provocar: {texto: "Provocar", valor: Provocar},
    llamarada: {texto: "Llamarada", valor: llamarada},
    PosturaDef: {texto: "Postura Defensiva", valor: Postura_Defensiva},
    EspadaDelJuicio: {texto: "Espada del juicio", valor: Espada_Del_Juicio}
  },
  magias: {
    fire_Ball: {texto: "Bola de Fuego", valor: fireBall}
  },
  signals: [ValentiaOnCast, ValentiaOnDamage, Contrafulgor, señalDeataque]
}

export {MoldeAlexandrius}