import {
  CORAZA,
  ESCUDO,
  FUERZA_FERREA,
  LLAMARADA_DEF,
  LLAMARADA_RES,
  POSTURA_DEFENSIVA_DEF,
  POSTURA_DEFENSIVA_RES,
  MODIFIER_MANAGER,
  PRISA,
  FRENO,
  VALENTIA,
  PROVOCAR_DEBUFF,
  CEGUERA,
  PARALISIS_MODIFIER,
  MURO_DE_PIEDRA,
  FURIA_DRAGON_VEL,
  FURIA_DRAGON_ATQ,
  FURIA_DRAGON_MAG,
  CONCENTRACION_CRIT_RATE,
  CONCENTRACION_CRIT_DMG,
  VIENTO_AFIN_VEL,
  PRECISION_DEBUFF,
  RESISTENCIA_DEBUFF,
  VELOCIDAD_DEBUFF,
  ROMPEBRAZO_DEBUFF,
  QUIEBRAESCUDOS_DEBUFF,
  EMOCION_COMBATE_BUFF_ATQ,
  EMOCION_COMBATE_BUFF_DEF,
  EMOCION_COMBATE_BUFF_VEL,
  DEBILITAR_NIEBLA
} from './modifier.js';
import { numeroAleatorio } from "../main.js";

import { PROVOCAR, QUEMADURA, SANGRADO, VENENO, PARALISIS, CONGELAR, REVITALIA, ATURDIDO } from "./status.js";

class Habilidad {
  constructor({
    nombre,
    efecto = () => { console.log("Wow, aquí no hay nada") },
    costo = 0,
    subEfecto = null,
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
    this.subEfecto = subEfecto;
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
    let fail = this.abilityFail(usuario);

    if (fail == true) {
      alert(`${usuario.nombre} falló el ataque`);
      return;
    }
  console.log("[Habilidad.usar] ", this.nombre, { usuario, objetivo });
  usuario.actuar(objetivo, this.efecto.bind(this), this.tipo);
  this.aplicarSubEfecto(usuario, objetivo)

}
  consumirRecurso(usuario){
    usuario.mana -= this.costo;
  }

  abilityFail(usuario){
    let totalPrecision = (usuario.precision + this.precision) / 2;
    if (totalPrecision < numeroAleatorio()) {
      return true; // falla
    }
    else {
      return false; // acierta
    }
  }
  aplicarSubEfecto(usuario, objetivo){
    let totalProbEfecto = usuario.malicia + this.probEfecto;
    if (totalProbEfecto >= numeroAleatorio() && typeof this.subEfecto === "function") {
      this.subEfecto(objetivo);
    };
  }
}

/* --> COMDANDOS BASICOS <--*/
const ataque = new Habilidad({
  nombre: "ataque",
  efecto: (usuario, objetivo) => {
    if (!objetivo || typeof objetivo.recibirDamage !== "function") {
      console.error("El objetivo no es válido o no tiene recibirDamage()", objetivo);
      return;
    }
    objetivo.recibirDamage(usuario.totalAtq, usuario);
  },
  naturaleza: "ofensivo",
  tipo: "ataque",
  precision: 100
});

const recargarMana = new Habilidad({
  nombre: "Recargar",
  efecto: (usuario) => {
    usuario.manaRestaurar(40)
  },
  naturaleza: "defensiva",
  rango: "propio",
  precision: 500
})

/* --> MAGIAS <--*/
const fireBall = new Habilidad({
  nombre: "Fire Ball",
  efecto: (usuario, objetivo) => {
    usuario.mana -= fireBall.costo;
    console.log(`${usuario.nombre} ha perdido ${fireBall.costo} de Mana`);
    let damage = usuario.totalMagia * fireBall.escalado;
    objetivo.recibirDamageMagico(damage, usuario);
  },
  costo: 10,
  escalado: 1,
  tipo: "magia",
  naturaleza: "ofensivo",
  precision: 100,
  subEfecto: (objetivo)=> {QUEMADURA.aplicarEstado(objetivo);
    alert(`${objetivo.nombre} se ha quemado`)
  },
  probEfecto: 50
});

const curar = new Habilidad({
  nombre: "curar",
  efecto: (usuario, objetivo) => {
    let curacion = usuario.totalMagia * curar.escalado;
    objetivo.curar(curacion)
    console.log(`${objetivo.nombre} se ha curado`);
  },
  escalado: 1,
  tipo: "magia",
  naturaleza: "defensivo",
  costo: 20,
  precision: 500,
  rango: "unico"
});

const Revitalia = new Habilidad({
  nombre: "Revitalia",
  efecto: (usuario, objetivo) => {
    objetivo.curar((usuario.totalMagia * 0.1) + (objetivo.base.vida * 0.01))
  },
  naturaleza: "defensivo",
  tipo: "magia",
  costo: 50,
  rango: "unico",
  subEfecto: (objetivo) => {
    REVITALIA.aplicarEstado(objetivo);
  },
  probEfecto: 100,
  precision: 200
})

const Coraza = new Habilidad({
  nombre: "Coraza",
  efecto: (usuario, objetivo) => {
    CORAZA.aplicarModificador(objetivo);
  },
  naturaleza: "defensivo",
  tipo: "magia",
  costo: 30,
  rango: "unico",
  precision: 200
})

const Rayo_Descendente = new Habilidad({
  nombre: "Rayo Descendente",
  efecto: (usuario, objetivo) => {
    objetivo.recibirDamageMagico(usuario.totalMagia * Rayo_Descendente.escalado, usuario);
  },
  naturaleza: "ofensivo",
  tipo: "magia",
  costo: 30,
  escalado: 1.3,
  rango: "unico",
  subEfecto: (objetivo) => {
    PARALISIS.aplicarEstado(objetivo);
    PARALISIS_MODIFIER.aplicarModificador(objetivo);
  },
  probEfecto: 30,
  precision: 90
});

const Estalactitas_De_Hielo = new Habilidad({
  nombre: "Estalactitas de hielo",
  efecto: (usuario, objetivo) => {
    objetivo.recibirDamageMagico(usuario.totalMagia * Estalactitas_De_Hielo.escalado, usuario);
  },
  escalado: 0.7,
  tipo: "magia",
  costo: 20,
  naturaleza: "ofensivo",
  rango: "unico",
  subEfecto: (objetivo) => CONGELAR.aplicarEstado(objetivo),
  probEfecto: 100
});

const Viento_Cortante = new Habilidad({
  nombre: "Viento Cortante",
  efecto: (usuario, objetivo) => {
    objetivo.recibirDamageMagico(usuario.totalMagia * Viento_Cortante.escalado, usuario, true);
  },
  escalado: 0.8,
  tipo: "magia",
  costo: 30,
  naturaleza: "ofensivo",
  rango: "unico",
  subEfecto: (objetivo) => ATURDIDO.aplicarEstado(objetivo),
  probEfecto: 100
})

const drenaje = new Habilidad({
  nombre: "Drenaje",
  efecto: (usuario, objetivo) =>{
    usuario.curar(objetivo.recibirDamageMagico(usuario.totalMagia * drenaje.escalado, usuario));
  },
  escalado: 0.7,
  tipo: "magia",
  naturaleza: "ofensivo",
  costo: 30,
  precision: 95,
  rango: "unico"
});

const Sanctus = new Habilidad({
  nombre: "Sanctus",
  efecto: (usuario, objetivo) => {
    objetivo.recibirDamageMagico(usuario.totalMagia * Sanctus.escalado, usuario);
  },
  escalado: 3,
  tipo: "magia",
  naturaleza: "ofensivo",
  costo: 200,
  precision: 100,
  rango: "unico"
})
/* --> Habilidades <--*/
const Provocar = new Habilidad({
  nombre: "provocar",
  efecto: (usuario, objetivo) => {
    PROVOCAR_DEBUFF.aplicarModificador(objetivo);
    PROVOCAR.aplicarEstado(objetivo);
  },
  naturaleza: "ofensivo",
  rango: "unico",
  tipo: "habilidad",
  precision: 100
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
  rango: "propio",
  precision: 100
});

const llamarada = new Habilidad({
  nombre: "Llamarada",
  tipo: "magia",
  rango: "todos",
  naturaleza: "ofensivo",
  costo: 25,
  tipoDeDano: "magico",
  escalado: 1.5,
  precision: 100,
  efecto: (usuario, objetivo) => {
    objetivo.recibirDamageMagico(usuario.totalMagia * llamarada.escalado, usuario);
    LLAMARADA_DEF.aplicarModificador(objetivo);
    LLAMARADA_RES.aplicarModificador(objetivo);
  }
});

const Espada_Del_Juicio = new Habilidad({
  nombre: "Espada del Juicio",
  tipo: "magia",
  rango: "unico",
  naturaleza: "ofensivo",
  costo: 100,
  tipoDeDano: "magico",
  escalado: 4,
  precision: 100,
  efecto: (usuario, objetivo) => {
    objetivo.recibirDamageMagico(usuario.totalMagia * Espada_Del_Juicio.escalado, usuario);
  }
});

const Aspir = new Habilidad({
  nombre: "Aspir",
  efecto: (usuario, objetivo) =>{
    usuario.manaRestaurar(objetivo.perderMana(usuario.totalMagia * Aspir.escalado))
  },
  escalado: 0.5,
  tipo: "magia",
  naturaleza: "ofensivo",
  costo: 0,
  precision: 95,
  rango: "unico"
})

const Nube_De_Gas = new Habilidad({
  nombre: "Llamarada",
  tipo: "magia",
  rango: "todos",
  naturaleza: "ofensivo",
  costo: 25,
  tipoDeDano: "magico",
  escalado: 1,
  precision: 90,
  efecto: (usuario, objetivo) => {
    objetivo.recibirDamageMagico(usuario.totalMagia, usuario)
  },
  subEfecto: (objetivo)=> {VENENO.aplicarEstado(objetivo);
  },
  probEfecto: 50
})

const Agujero_Negro = new Habilidad({
  nombre: "Drenaje",
  efecto: (usuario, objetivo) =>{
    usuario.curar(objetivo.recibirDamageMagico(usuario.totalMagia * 0.7, usuario));
  },
  escalado: 0.7,
  tipo: "magia",
  naturaleza: "ofensivo",
  costo: 60,
  precision: 90,
  rango: "todos",
})

const Umbrasemillas = new Habilidad({
  nombre: "Umbrasemillas",
  tipo: "magia",
  rango: "todos",
  naturaleza: "ofensivo",
  costo: 100,
  tipoDeDano: "magico",
  escalado: 2,
  precision: 90,
  efecto: (usuario, objetivo) => {
    objetivo.recibirDamageMagico(usuario.totalMagia * Umbrasemillas.escalado, usuario)
  },
  subEfecto: (objetivo)=> {
    VENENO.aplicarEstado(objetivo);
    CEGUERA.aplicarModificador(objetivo);
  },
  probEfecto: 50
})

/* -->⛪ Alblanc (Sacerdotisa) ⛪ <--*/

const Muro_De_Piedra = new Habilidad({
  nombre: "Muro de piedra",
  efecto: (usuario, objetivo) => {
    MURO_DE_PIEDRA.aplicarModificador(objetivo);
  },
  tipo: "habilidad",
  naturaleza: "defensivo",
  rango: "unico",
  precision: 200
})

const Temblor = new Habilidad({
  nombre: "Temblor",
  efecto: (usuario, objetivo) => {
    objetivo.recibirDamageMagico(usuario.totalMagia * Temblor.escalado, usuario)
  },
  tipo: "magia",
  rango: "todos",
  naturaleza: "ofensivo",
  costo: 100,
  tipoDeDano: "magico",
  escalado: 2,
  precision: 90,
  subEfecto: (objetivo)=> {
    FRENO.aplicarModificador(objetivo);
  },
  probEfecto: 50
})

const Roca = new Habilidad({
  nombre: "Roca",
  efecto: (usuario, objetivo) => {
    objetivo.recibirDamageMagico(usuario.totalMagia * Roca.escalado, usuario)
  },
  tipo: "magia",
  rango: "unico",
  naturaleza: "ofensivo",
  costo: 20,
  tipoDeDano: "magico",
  escalado: 1.3,
  precision: 90,
  subEfecto: (objetivo)=> {
    FRENO.aplicarModificador(objetivo);
  },
  probEfecto: 50
})

const Bendición_De_Obsidiana = new Habilidad({
  nombre: "Postura Defensiva",
  efecto: (usuario, objetivo) => {
    objetivo.ganarEscudo(usuario.base.vida);
    ESCUDO.aplicarModificador(objetivo);
    CORAZA.aplicarModificador(objetivo);
  },
  tipo: "magia",
  naturaleza: "defensivo",
  rango: "unico",
  costo: 200,
  precision: 100
})

/* --> ❄️ Masamune (Asesino Gélido) ❄️ <--*/

const Tornado = new Habilidad({
  nombre: "Tornado",
  efecto: (usuario, objetivo) =>{
    objetivo.recibirDamageFisico(usuario.totalAtq * Tornado.escalado, usuario);
  },
  tipo: "habilidad",
  naturaleza: "ofensivo",
  rango: "unico",
  precision: 90,
  escalado: 1,
  subEfecto: (objetivo) => {
    ATURDIDO.aplicarEstado(objetivo)
  },
  probEfecto: 90
})

const Cercenamiento_Gelido = new Habilidad({
  nombre: "Cercenamiento Gelido",
  efecto: (usuario, objetivo) => {
    objetivo.recibirDamageFisico(usuario.totalAtq * Cercenamiento_Gelido.escalado, usuario);
    usuario.ganarEscudo(20);
  },
  tipo: "habilidad",
  naturaleza: "ofensivo",
  rango: "todos",
  precision: 100,
  escalado: 7,
  subEfecto: (objetivo) => {
    CONGELAR.aplicarEstado(objetivo)
  },
  probEfecto: 30,
})

const Furia_De_Dragon = new Habilidad({
  nombre: "Furia de Dragón",
  efecto: (usuario, objetivo) => {
    FURIA_DRAGON_VEL.aplicarModificador(usuario);
    FURIA_DRAGON_ATQ.aplicarModificador(usuario);
    FURIA_DRAGON_MAG.aplicarModificador(usuario);
  },
  tipo: "habilidad",
  naturaleza: "defensivo",
  rango: "propio",
  precision: 100
});

const Invierno_Draconico = new Habilidad({
  nombre: "Invierno Draconico",
  efecto: (usuario, objetivo) => {
    objetivo.recibirDamageMagico(usuario.totalMagia * Invierno_Draconico.escalado, usuario);
  },
  tipo: "magia",
  naturaleza: "ofensivo",
  rango: "todos",
  precision: 90,
  escalado: 1.5,
  subEfecto: (objetivo) => {
    CONGELAR.aplicarEstado(objetivo)
  },
  probEfecto: 80,
})

/* --> 🏹 Nicanora (Arquera) 🏹<--*/

const Tiro_Elegido = new Habilidad({
  nombre: "Tiro Elegido",
  efecto: (usuario, objetivo) => {
    objetivo.recibirDamageFisico(usuario.totalAtq * Tiro_Elegido.escalado, usuario, true);
  },
  naturaleza: "ofensivo",
  tipo: "habilidad",
  costo: 30,
  escalado: 1.5,
  rango: "unico",
  subEfecto: (objetivo) => {
    PARALISIS.aplicarEstado(objetivo);
    PARALISIS_MODIFIER.aplicarModificador(objetivo);
  },
  probEfecto: 30,
  precision: 100
});

const Concentracion = new Habilidad({
  nombre: "Concentración",
  efecto: (usuario, objetivo) => {
    CONCENTRACION_CRIT_RATE.aplicarModificador(usuario);
    CONCENTRACION_CRIT_DMG.aplicarModificador(usuario);
    console.log(usuario.totalCritRate, usuario.totalCritDamage);

  },
  tipo: "habilidad",
  naturaleza: "buff",
  rango: "propio",
  precision: 100
});

const Cañon_Desctructor = new Habilidad({
  nombre: "Cañon Destructor",
  efecto: (usuario, objetivo) => {
    objetivo.recibirDamageFisico(usuario.totalAtq * Tiro_Elegido.escalado, usuario);
  },
  naturaleza: "ofensivo",
  tipo: "habilidad",
  costo: 150,
  escalado: 3,
  rango: "unico",
  subEfecto: (objetivo) => {
    PARALISIS.aplicarEstado(objetivo);
    PARALISIS_MODIFIER.aplicarModificador(objetivo);
  },
  probEfecto: 30,
  precision: 100
});

const Tormenta_De_Flechas = new Habilidad({
  nombre: "Tormenta de Flechas",
  efecto: (usuario, objetivo) => {
    objetivo.recibirDamageFisico(usuario.totalAtq * Tiro_Elegido.escalado, usuario, true);
  },
  naturaleza: "ofensivo",
  tipo: "habilidad",
  costo: 70,
  escalado: 1.5,
  rango: "todos",
  subEfecto: (objetivo) => {
    PARALISIS.aplicarEstado(objetivo);
    PARALISIS_MODIFIER.aplicarModificador(objetivo);
  },
  probEfecto: 50,
  precision: 90
});

/* --> HABILIDADES KABUTO <--*/

const Viento_Afin = new Habilidad({
  nombre: "Viento Afín",
  efecto: (usuario, objetivo) => {
      VIENTO_AFIN_VEL.aplicarModificador(objetivo);
  },
  tipo: "habilidad",
  naturaleza: "buff",
  rango: "todos",
  precision: 500
});

const Impulso_Vengativo = new Habilidad({
  nombre: "Impulso vengativo",
  efecto: (usuario, objetivo) => {
    // El usuario sacrifica 20% de su vida actual
    const costoVida = Math.floor(usuario.vida * 0.2);
    usuario.vida -= costoVida;
    // Daño aumentado (ejemplo: 2.5x ataque total)
    objetivo.recibirDamageFisico(usuario.totalAtq * Impulso_Vengativo.escalado, usuario);
  },
  tipo: "habilidad",
  naturaleza: "ofensivo",
  rango: "unico",
  precision: 100,
  escalado: 2.5, // muy alto porque sacrifica vida
});

const Corte_Aereo = new Habilidad({
  nombre: "Corte aéreo",
  efecto: (usuario, objetivo) => {
    objetivo.recibirDamageFisico(usuario.totalAtq * Corte_Aereo.escalado, usuario);
  },
  tipo: "habilidad",
  naturaleza: "ofensivo",
  rango: "unico",
  precision: 95,
  escalado: 1.2,
  subEfecto: (objetivo) => {
    ATURDIDO.aplicarEstado(objetivo);
  },
  probEfecto: 70 // 70% de probabilidad de aturdir
});

const Venganza = new Habilidad({
  nombre: "Venganza",
  efecto: (usuario, objetivo) => {
    const vidaFaltante = usuario.base.vida - usuario.vida;
    const damage = vidaFaltante + usuario.totalAtq * Venganza.escalado;
    objetivo.recibirDamageFisico(damage, usuario);
  },
  tipo: "habilidad",
  naturaleza: "ofensivo",
  rango: "unico",
  precision: 100,
  costo: 100,
  escalado: 1.2 // ajusta este multiplicador para balancear
});



/* --> HABILIDADES ACTIVADAS POR SEÑALES <--*/
const signal_Contrafulgor = new Habilidad({
  nombre: "Contrafulgor",
  tipo: "habilidad",
  rango: "unico",
  naturaleza: "ofensivo",
  tipoDeDano: "magico",
  escalado: 1,
  precision: 100,
  efecto: (usuario, objetivo) => {
  console.log("[Contrafulgor.efecto]", { usuario, objetivo });
  if (!objetivo) {
    console.error("[Contrafulgor.efecto] ❌ Objetivo undefined");
    return;
  }

  let damage = usuario.totalMagia * 0.7;
  objetivo.recibirDamageMagico(damage, usuario);
  QUEMADURA.aplicarEstado(objetivo)
}

});

/* --> HABILIDADES ENEMIGAS <--*/
const mordisco = new Habilidad({
  nombre: "mordisco",
  efecto: (usuario, objetivo) => {

    objetivo.recibirDamageFisico(usuario.totalAtq, usuario);
    SANGRADO.aplicarEstado(objetivo);
  },
  naturaleza: "ofensivo",
  tipo: "habilidad",
  rango: "unico",
  tipoDeDano: "fisico",
  precision: 100
});

const autoDestruccion = new Habilidad({
  nombre: "BOOM",
  efecto: (usuario, objetivo) => {

    objetivo.recibirDamageFisico(usuario.totalAtq * autoDestruccion.escalado, usuario);

    alert("Lobo se autodestruyó!!")
  },
  naturaleza: "ofensivo",
  tipo: "habilidad",
  rango: "unico",
  tipoDeDano: "fisico",
  escalado: 6,
  precision: 100
})

const MagoOscuro_NieblaNegra = new Habilidad({
  nombre: "Niebla Negra",
  efecto: (usuario, objetivo) => {
    // Aplica debuff de precisión
    PRECISION_DEBUFF.aplicarModificador(objetivo);
  },
  tipo: "habilidad",
  naturaleza: "ofensivo",
  rango: "unico",
  precision: 90,
  probEfecto: 100
});

const MagoOscuro_EsferaOscura = new Habilidad({
  nombre: "Esfera Oscura",
  efecto: (usuario, objetivo) => {
    // Daño mágico
    objetivo.recibirDamageMagico(usuario.magia * MagoOscuro_EsferaOscura.escalado, usuario);
    // Posible reducción de resistencia mágica
    RESISTENCIA_DEBUFF.aplicarModificador(objetivo);
  },
  tipo: "habilidad",
  naturaleza: "ofensivo",
  rango: "unico",
  precision: 95,
  escalado: 1.3,
  probEfecto: 50
});

const MagoOscuro_Nictoplasma = new Habilidad({
  nombre: "Nictoplasma",
  efecto: (usuario, objetivo) => {
    VELOCIDAD_DEBUFF.aplicarModificador(objetivo);
  },
  tipo: "habilidad",
  naturaleza: "ofensivo",
  rango: "unico",
  precision: 90,
  escalado: 0, // no hace daño
  probEfecto: 100
});

const GuerreroOscuro_Rompebrazo = new Habilidad({
  nombre: "Rompebrazo",
  efecto: (usuario, objetivo) => {
    objetivo.recibirDamageFisico(usuario.totalAtq * GuerreroOscuro_Rompebrazo.escalado, usuario);
  },
  tipo: "habilidad",
  naturaleza: "ofensivo",
  rango: "unico",
  precision: 95,
  escalado: 1.2,
  subEfecto: (objetivo) => {
    ROMPEBRAZO_DEBUFF.aplicarModificador(objetivo);
  },
  probEfecto: 80
});

const GuerreroOscuro_Quiebraescudos = new Habilidad({
  nombre: "Quiebraescudos",
  efecto: (usuario, objetivo) => {
    objetivo.recibirDamageFisico(usuario.totalAtq * GuerreroOscuro_Quiebraescudos.escalado, usuario);
  },
  tipo: "habilidad",
  naturaleza: "ofensivo",
  rango: "unico",
  precision: 90,
  escalado: 1.1,
  subEfecto: (objetivo) => {
    QUIEBRAESCUDOS_DEBUFF.aplicarModificador(objetivo);
  },
  probEfecto: 80
});

const GuerreroOscuro_EmocionDeCombate = new Habilidad({
  nombre: "Emoción de Combate",
  efecto: (usuario, objetivo) => {
    EMOCION_COMBATE_BUFF_ATQ.aplicarModificador(usuario);
    EMOCION_COMBATE_BUFF_DEF.aplicarModificador(usuario);
    EMOCION_COMBATE_BUFF_VEL.aplicarModificador(usuario);
  },
  tipo: "habilidad",
  naturaleza: "defensivo",
  rango: "propio",
  precision: 100
});

// 🩸 Mordida Carmesí
const Mordida_Carmesi = new Habilidad({
  nombre: "Mordida Carmesí",
  efecto: (usuario, objetivo) => {
    usuario.curar(objetivo.recibirDamageFisico(usuario.totalAtq * Mordida_Carmesi.escalado, usuario));

  },
  tipo: "habilidad",
  naturaleza: "ofensivo",
  rango: "unico",
  tipoDeDano: "fisico",
  escalado: 1.2,
  precision: 100,
  subEfecto: (objetivo) => {
    SANGRADO.aplicarEstado(objetivo);
  },
  probEfecto: 70
});


// 🌫️ Niebla Sangrienta
const Niebla_Sangrienta = new Habilidad({
  nombre: "Niebla Sangrienta",
  efecto: (usuario, objetivo) => {
    objetivo.recibirDamageMagico(usuario.totalMagia, usuario)
    DEBILITAR_NIEBLA.aplicarModificador(objetivo)
  },
  tipo: "habilidad",
  naturaleza: "ofensivo",
  rango: "todos",
  costo: 80,
  precision: 200
});

const Vampiro_AbrazoUmbrio = new Habilidad({
  nombre: "Abrazo Umbrío",
  efecto: (usuario, objetivo) => {
    const damage = usuario.totalMagia * Vampiro_AbrazoUmbrio.escalado;
    objetivo.recibirDamageMagico(damage, usuario);
    ATURDIDO.aplicarEstado(objetivo);
    console.log(`${usuario.nombre} envuelve a ${objetivo.nombre} en sombras drenantes.`);
  },
  tipo: "habilidad",
  naturaleza: "ofensivo",
  rango: "unico",
  tipoDeDano: "magico",
  escalado: 0.8,
  precision: 95,
});

const Vampiro_MaldicionCarmesi = new Habilidad({
  nombre: "Maldición Carmesí",
  efecto: (usuario, objetivo) => {
    objetivo.recibirDamageMagico(usuario.totalMagia * Vampiro_MaldicionCarmesi.escalado, usuario);
    console.log(`${usuario.nombre} lanza una maldición que corrompe la sangre de ${objetivo.nombre}.`);
  },
  tipo: "habilidad",
  naturaleza: "ofensivo",
  rango: "unico",
  tipoDeDano: "magico",
  escalado: 1.1,
  precision: 90,
  probEfecto: 60,
  subEfecto(objetivo){
    SANGRADO.aplicarEstado(objetivo);
  }
});

// ⚫ Devora-Almas
const Vampiro_DevoraAlmas = new Habilidad({
  nombre: "Devora-Almas",
  efecto: (usuario, objetivo) => {
    const damage = usuario.totalMagia * Vampiro_DevoraAlmas.escalado;
    objetivo.recibirDamageMagico(damage, usuario);
    usuario.curar(damage * 2);
    console.log(`${usuario.nombre} devora el alma de ${objetivo.nombre} y se fortalece.`);
  },
  tipo: "habilidad",
  naturaleza: "ofensivo",
  rango: "unico",
  tipoDeDano: "magico",
  escalado: 1.6,
  precision: 90
});

// 🌑 Requiem del Vacío
const Vampiro_RequiemDelVacio = new Habilidad({
  nombre: "Requiem del Vacío",
  efecto: (usuario, objetivo) => {
    const damage = usuario.totalMagia * Vampiro_RequiemDelVacio.escalado;
    objetivo.recibirDamageMagico(damage, usuario);
    usuario.curar(damage * 1);
    console.log(`${usuario.nombre} libera un estallido final de energía del vacío.`);
  },
  tipo: "habilidad",
  naturaleza: "ofensivo",
  rango: "todos",
  tipoDeDano: "magico",
  escalado: 1.5,
  precision: 100
});


// 🧛‍♂️ Molde del Vampiro Antiguo
const VampiroAntiguo = {
  nombre: "Lord Noctarion",
  grupo: "enemigo",
  vida: 1800,
  mana: 400,
  atq: 120,
  def: 60,
  magia: 90,
  res: 50,
  vel: 35,
  heroe: "VampiroAntiguo",
  comportamiento: "tanque",
  segundaFase: false,
  acciones: [
    { texto: "Mordida Carmesí", accion: Mordida_Carmesi },
    { texto: "Niebla Sangrienta", accion: Niebla_Sangrienta }
  ],
  onDeath() {
    Resurreccion_Carmesi(this);
  }
};



export {
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
  Venganza,
  //enemigos
  //LOBO
  mordisco,
  autoDestruccion,
  //MAGO OSCURO
  MagoOscuro_EsferaOscura,
  MagoOscuro_Nictoplasma,
  MagoOscuro_NieblaNegra,
  //Guerrero oscuro
  GuerreroOscuro_Rompebrazo,
  GuerreroOscuro_Quiebraescudos,
  GuerreroOscuro_EmocionDeCombate,
  // Vampiro carmesí
  Mordida_Carmesi,
  Niebla_Sangrienta,
  Vampiro_AbrazoUmbrio,
  Vampiro_MaldicionCarmesi,
  Vampiro_DevoraAlmas,
  Vampiro_RequiemDelVacio,
};
