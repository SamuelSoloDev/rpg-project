import { Heroe, ValentiaSignal } from "./personaje.js";
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
  //Habilidades Alex
  Provocar,
  Postura_Defensiva,
  llamarada,
  Espada_Del_Juicio,
  signal_Contrafulgor,
  //Habilidades Raissa
  Aspir,
  Nube_De_Gas,
  Agujero_Negro,
  Umbrasemillas,
  //Habilidades Alblanc
  Muro_De_Piedra,
  Roca,
  Temblor,
  Bendición_De_Obsidiana,
  //Habilidades Masamune
  Tornado,
  Cercenamiento_Gelido,
  Furia_De_Dragon,
  Invierno_Draconico,
  //Habilidades Nicanora
  Tiro_Elegido,
  Concentracion,
  Cañon_Desctructor,
  Tormenta_De_Flechas,
  //Habilidades Kabuto
  Viento_Afin,
  Impulso_Vengativo,
  Corte_Aereo,
  Venganza
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

    },
    statsPropios: null,
    tipoSeñal: "onTakeDamage"
    });

 const  ValentiaOnCast = new Signal ({
      nombre: "valentiaOnCast",
      ejecutar: function ({usuario}) {
        MODIFIER_MANAGER.reducirModifier(usuario, "buff", "onCastSpell")

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
        usuario.manaRestaurar(20)
      },
      tipoSeñal: "onAttack"
  })
  const señalCritico = new Signal({
  nombre: "señalCritico",
  ejecutar: function ({ usuario, objetivo, dañoFinal }) {
    // Aquí defines lo que pasa en un crítico

    // Ejemplo: restaurar un poco de maná al atacante
    // Ejemplo: dar un buff temporal (si lo manejas en tu sistema)
    // usuario.aplicarEstado(new Estado("Inspirado", { duracion: 2, bonus: { daño: 0.2 }}))
  },
  tipoSeñal: "onCriticalHit"
});

 const señalDoubleHit = new Signal({
  nombre: "DoubleHit",
  ejecutar: ({usuario, objetivo}) =>{
    if (usuario._ataqueDoble) return;
    usuario._ataqueDoble = true;
    setTimeout(() => {
      usuario.atacar(objetivo)
      usuario._ataqueDoble = false;
    }, 1000);

  },
  tipoSeñal: "onAttack"
 })



//moldes
const MoldeHeroe = {
  Alexandrius: {
    nombre: "Alexandrius",
    grupo: "aliado",
    vida: 200,
    mana: 300,
    atq: 24,
    def: 40,
    magia: 48,
    res: 40,
    vel: 20,
    heroe: "Alexandrius",
    habilidades: {
      provocar: { texto: "Provocar", valor: Provocar },
      llamarada: { texto: "Llamarada", valor: llamarada },
      PosturaDef: { texto: "Postura Defensiva", valor: Postura_Defensiva },
      EspadaDelJuicio: { texto: "Espada del juicio", valor: Espada_Del_Juicio }
    },
    magias: {
      fire_Ball: { texto: "Bola de Fuego", valor: fireBall },
      drenaje: { texto: "Drenaje", valor: drenaje }
    },
    signals: [ValentiaOnCast, ValentiaOnDamage, Contrafulgor, señalDeataque]
  },

  Raissa: {
    nombre: "Raissa",
    grupo: "aliado",
    vida: 90,
    mana: 400,
    atq: 20,
    def: 15,
    magia: 60,
    res: 30,
    vel: 21,
    malicia: 25,
    heroe: "Raissa",
    habilidades: {
      Aspir: { texto: "Aspir", valor: Aspir },
      Nube_De_Gas: { texto: "Nube de Gas", valor: Nube_De_Gas },
      Agujero_Negro: { texto: "Agujero Negro", valor: Agujero_Negro },
      Umbrasemillas: { texto: "Umbrasemillas", valor: Umbrasemillas }
    },
    magias: {
      drenaje: { texto: "Drenaje", valor: drenaje },
      Estalactitas_De_Hielo: { texto: "Estalactitas de Hielo", valor: Estalactitas_De_Hielo },
      Rayo_Descendente: { texto: "Rayo Descendente", valor: Rayo_Descendente }
    }
  },

  Alblanc: {
    nombre: "Alblanc",
    grupo: "aliado",
    vida: 120,
    mana: 300,
    atq: 40,
    def: 20,
    magia: 70,
    res: 30,
    vel: 18,
    regeneracionDeMana: 25,
    sprite: "Alblanc.png",
    heroe: "Alblanc",
    habilidades: {
      Muro_De_Piedra: { texto: "Muro de Piedra", valor: Muro_De_Piedra },
      Roca: { texto: "Roca", valor: Roca },
      Temblor: { texto: "Temblor", valor: Temblor },
      Bendición_De_Obsidiana: { texto: "Bendición de Obsidiana", valor: Bendición_De_Obsidiana }
    },
    magias: {
      cura: { texto: "Cura", valor: curar },
      revitalia: { texto: "Revitalia", valor: Revitalia },
      coraza: { texto: "Coraza", valor: Coraza },
      sanctus: { texto: "Sanctus", valor: Sanctus }
    }
  },

  Masamune: {
    nombre: "Masamune",
    grupo: "aliado",
    vida: 100,
    mana: 250,
    atq: 60,
    def: 15,
    magia: 40,
    res: 15,
    vel: 24,
    sprite: "Masamune.png",
    heroe: "Masamune",
    habilidades: {
      Tornado: { texto: "Tornado", valor: Tornado },
      Cercenamiento_Gelido: { texto: "Cercenamiento Gélido", valor: Cercenamiento_Gelido },
      Furia_De_Dragon: { texto: "Furia de Dragón", valor: Furia_De_Dragon },
      Invierno_Draconico: { texto: "Invierno Dracónico", valor: Invierno_Draconico }
    },
    magias: {
      Estalactitas_De_Hielo: { texto: "Estalactitas de Hielo", valor: Estalactitas_De_Hielo },
      Rayo_Descendente: { texto: "Rayo Descendente", valor: Rayo_Descendente },
      fire_Ball: { texto: "Bola de Fuego", valor: fireBall },
      Viento_Cortante: { texto: "Viento Cortante", valor: Viento_Cortante }
    },
    signals: [señalDoubleHit]
  },

  Kabuto: {
    nombre: "Kabuto",
    grupo: "aliado",
    vida: 200,
    mana: 300,
    atq: 75,
    def: 20,
    magia: 40,
    res: 25,
    vel: 22,
    heroe: "Kabuto",
    habilidades: {
      Viento_Afin: { texto: "Viento Afín", valor: Viento_Afin },
      Impulso_Vengativo: { texto: "Impulso Vengativo", valor: Impulso_Vengativo },
      Corte_Aereo: { texto: "Corte Aéreo", valor: Corte_Aereo },
      Venganza: { texto: "Venganza", valor: Venganza }
    },
    magias: {
      Viento_Cortante: { texto: "Viento Cortante", valor: Viento_Cortante },
      Drenaje: { texto: "Drenaje", valor: drenaje },
      Estalactita: { texto: "Estalactitas de Hielo", valor: Estalactitas_De_Hielo }
    }
  },

  Nicanora: {
    nombre: "Nicanora",
    grupo: "aliado",
    vida: 110,
    mana: 250,
    atq: 65,
    def: 18,
    magia: 24,
    res: 20,
    vel: 19,
    critRate: 25,
    critDamage: 2,
    heroe: "Nicanora",
    habilidades: {
      Tiro_Elegido: { texto: "Tiro Elegido", valor: Tiro_Elegido },
      Concentracion: { texto: "Concentración", valor: Concentracion },
      Cañon_Desctructor: { texto: "Cañón Destructor", valor: Cañon_Desctructor },
      Tormenta_De_Flechas: { texto: "Tormenta de Flechas", valor: Tormenta_De_Flechas }
    },
    magias: {
      Rayo_Descendente: { texto: "Rayo Descendente", valor: Rayo_Descendente },
      fire_Ball: { texto: "Bola de Fuego", valor: fireBall }
    }
  }
};


export {MoldeHeroe, señalCritico}