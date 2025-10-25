import {
  ataque,
  recargarMana,
  //Magias
  fireBall,
  curar,
  Coraza,
  Revitalia,
  Sanctus,
  drenaje,
  Estalactitas_De_Hielo,
  Rayo_Descendente,
  Viento_Cortante,
  //lobo
  mordisco,
  autoDestruccion,
  //mago oscuro
  MagoOscuro_EsferaOscura,
  MagoOscuro_Nictoplasma,
  MagoOscuro_NieblaNegra,
  //Guerrero oscuro
  GuerreroOscuro_Rompebrazo,
  GuerreroOscuro_Quiebraescudos,
  GuerreroOscuro_EmocionDeCombate,
  Mordida_Carmesi,
  Niebla_Sangrienta,
  Vampiro_AbrazoUmbrio,
  Vampiro_MaldicionCarmesi,
  Vampiro_DevoraAlmas,
  Vampiro_RequiemDelVacio,
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
import {turnManagerActualContext} from "../turnManager.js";


const Draenhal_revive = new Signal({
  nombre:"revive",
  ejecutar({usuario}){

    if (this.statsPropios.revive > 0) {
      usuario.curar(usuario.base.vida);
      this.statsPropios.revive--;
      usuario.activarSegundaFase();
    }
  },
  tipoSeñal: "onDeath",
  statsPropios: {
    revive: 1,
  }
})

const Draenhal_SeconFase = new Signal({
  nombre: "Second_Fase",
  ejecutar({usuario}){
    usuario.atq *= 1.4;
    usuario.magia *= 1.4;
    usuario.vel *= 1.3;
    usuario.sprite = "Draenhal2.png";

    usuario.aprenderHabilidades(
    [{ texto: "Mordida Carmesí", accion: Mordida_Carmesi },
    { texto: "Niebla Sangrienta", accion: Niebla_Sangrienta },
    { texto: "Maldición Carmesí", accion: Vampiro_MaldicionCarmesi },
    { texto: "Abrazo Umbrío", accion: Vampiro_AbrazoUmbrio },
    { texto: "Devora-Almas", accion: Vampiro_DevoraAlmas },
    { texto: "Requiem del Vacío", accion: Vampiro_RequiemDelVacio }]
    )
  },
  tipoSeñal: "onSecondFase"
})


const Molde = {
  Lobo: {
    nombre: "Lobo",
    grupo: "enemigo",
    vida: 120,
    mana: 0,
    atq: 30,
    def: 5,
    magia: 0,
    res: 3,
    vel: 20,
    heroe: "Lobo",
    acciones: [
      { texto: "Atacar", accion: ataque },
      { texto: "Mordisco", accion: mordisco }
    ],
    comportamiento: "kamikaze",
  },

  Saqueador: {
    nombre: "Saqueatumbas",
    grupo: "enemigo",
    vida: 220,
    mana: 100,
    atq: 25,
    def: 15,
    magia: 25,
    res: 15,
    vel: 18,
    heroe: "SaqueadorDeTumbas",
    acciones: [
      //{ texto: "Atacar", accion: ataque },
      { texto: "Estalactitas de Hielo", accion: Estalactitas_De_Hielo },
      //{ texto: "Rayo Descendente", accion: Rayo_Descendente },
      //{ texto: "Bola de Fuego", accion: fireBall },
      //{ texto: "Coraza", accion: Coraza }
    ],
    comportamiento: "fulminador"
  },

  MagoOscuro: {
    nombre: "MagoOscuro",
    grupo: "enemigo",
    vida: 200,
    mana: 150,
    atq: 10,
    def: 25,
    magia: 70,
    res: 25,
    vel: 23,
    heroe: "MagoOscuro",
    acciones: [
      { texto: "Atacar", accion: ataque },
      { texto: "Niebla Negra", accion: MagoOscuro_NieblaNegra },
      { texto: "Esfera Oscura", accion: MagoOscuro_EsferaOscura },
      { texto: "Nictoplasma", accion: MagoOscuro_Nictoplasma }
    ],
    comportamiento: "fulminador"
  },

  GuerreroOscuro: {
    nombre: "GuerreroOscuro",
    grupo: "enemigo",
    vida: 270,
    mana: 50,
    atq: 50,
    def: 30,
    magia: 20,
    res: 20,
    vel: 20,
    heroe: "GuerreroOscuro",
    acciones: [
      { texto: "Rompebrazo", accion: GuerreroOscuro_Rompebrazo },
      { texto: "Quiebraescudos", accion: GuerreroOscuro_Quiebraescudos },
      { texto: "Emoción de Combate", accion: GuerreroOscuro_EmocionDeCombate }
    ],
    comportamiento: "fulminador"
  },

  VampiroDelVacio : {
  nombre: "Draenhal",
  grupo: "enemigo",
  vida: 1000,
  mana: 2000,
  atq: 50,
  def: 15,
  magia: 60,
  res: 20,
  vel: 29,
  heroe: "VampiroDelVacio",
  acciones: [
    { texto: "Mordida Carmesí", accion: Mordida_Carmesi },
    { texto: "Niebla Sangrienta", accion: Niebla_Sangrienta },
    { texto: "Maldición Carmesí", accion: Vampiro_MaldicionCarmesi },
  ],
  comportamiento: "fulminador",
  signals: [Draenhal_revive, Draenhal_SeconFase]
}
};





export {Molde}