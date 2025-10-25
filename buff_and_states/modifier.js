class StatModifier {
  constructor({
    nombre,
    duracion,
    stat,
    valorEfecto,
    ritmo,
    tipo,
  }) {
    this.nombre = nombre;
    this.duracion = duracion;
    this.stat = stat;
    this.valorEfecto = valorEfecto;
    this.ritmo = ritmo;
    this.tipo = tipo;
    this.datos = {
      nombre,
      duracion,
      valorEfecto,
      ritmo,
      tipo
    }
  }

  aplicarModificador(personaje){
    let datos = this.datos;
    if (personaje[this.tipo][this.stat].find(mod => mod.nombre === this.nombre)) {
      return;
    }
    personaje[this.tipo][this.stat].push(datos);
  }
}

const MURO_DE_PIEDRA = new StatModifier({
  nombre: "Muro de piedra",
  duracion: 4,
  valorEfecto: 0.3,
  ritmo: "inicio",
  tipo: "buff",
  stat: "res"
})

const VALENTIA = new StatModifier({
  nombre: "valentia",
  duracion: 1,
  valorEfecto: 0.2,
  ritmo: "onCastSpell",
  tipo: "buff",
  stat: "magia"
})

const PRISA = new StatModifier({
  nombre: "prisa",
  duracion: 3,
  valorEfecto: 1,
  ritmo: "final",
  tipo: "buff",
  stat: "vel"
})

const FRENO = new StatModifier({
  nombre: "freno",
  duracion: 2,
  valorEfecto: 0.5,
  ritmo: "inicio",
  tipo: "debuff",
  stat: "vel"
})

const CORAZA = new StatModifier({
  nombre: "coraza",
  duracion: 3,
  valorEfecto: 0.5,
  ritmo: "inicio",
  tipo: "buff",
  stat: "def"
})

const ESCUDO = new StatModifier({
  nombre: "escudo",
  duracion: 3,
  valorEfecto: 0.5,
  ritmo: "inicio",
  tipo: "buff",
  stat: "res"
})

const FUERZA_FERREA = new StatModifier({
  nombre: "fuerza ferrea",
  duracion: 3,
  valorEfecto: 0.5,
  ritmo: "final",
  tipo: "buff",
  stat: "atq"
})

const LLAMARADA_DEF = new StatModifier({
  nombre: "llamarada def",
  duracion: 4,
  valorEfecto: 0.3,
  ritmo: "inicio",
  tipo: "debuff",
  stat: "def"
})

const LLAMARADA_RES = new StatModifier({
  nombre: "llamarada RES",
  duracion: 4,
  valorEfecto: 0.3,
  ritmo: "inicio",
  tipo: "debuff",
  stat: "res"
})

const POSTURA_DEFENSIVA_DEF = new StatModifier({
  nombre: "postura defensiva def",
  duracion: 4,
  valorEfecto: 0.5,
  ritmo: "inicio",
  tipo: "buff",
  stat: "def"
})

const POSTURA_DEFENSIVA_RES = new StatModifier({
  nombre: "postura defensiva res",
  duracion: 4,
  valorEfecto: 0.5,
  ritmo: "inicio",
  tipo: "buff",
  stat: "res"
})

const PROVOCAR_DEBUFF = new StatModifier({
  nombre: "provocar debuff",
  duracion: 2,
  valorEfecto: 0.3,
  ritmo: "final",
  tipo: "debuff",
  stat: "atq"
});

const CEGUERA = new StatModifier({
  nombre: "ceguera",
  duracion: 2,
  valorEfecto: 0.3,
  ritmo: "final",
  tipo: "debuff",
  stat: "precision"
})

const PARALISIS_MODIFIER = new StatModifier({
  nombre: "Paralisis[MOD]",
  duracion: 2,
  valorEfecto: 0.2,
  ritmo: "final",
  tipo: "debuff",
  stat: "vel"
})

const VIENTO_CORTANTE_MODIFIER = new StatModifier({
  nombre: "Aturdido[mod]",
  duracion: 1,
  valorEfecto: 0.3,
  ritmo: "inicio",
  tipo: "debuff",
  stat: "res"
})

const FURIA_DRAGON_VEL = new StatModifier({
  nombre: "furia de dragón vel",
  duracion: 3,            // el número de turnos que dure (ajústalo según tu diseño)
  valorEfecto: 0.3,       // +30% velocidad
  ritmo: "inicio",        // se aplica al inicio del turno
  tipo: "buff",
  stat: "vel"
});

const FURIA_DRAGON_ATQ = new StatModifier({
  nombre: "furia de dragón atq",
  duracion: 3,
  valorEfecto: 0.3,       // +30% ataque
  ritmo: "inicio",
  tipo: "buff",
  stat: "atq"
});

const FURIA_DRAGON_MAG = new StatModifier({
  nombre: "furia de dragón mag",
  duracion: 3,
  valorEfecto: 0.3,       // +30% magia
  ritmo: "inicio",
  tipo: "buff",
  stat: "magia"
});

const CONCENTRACION_CRIT_RATE = new StatModifier({
  nombre: "concentración critRate",
  duracion: 3,
  valorEfecto: 2, // +25% probabilidad crítica
  ritmo: "inicio",
  tipo: "buff",
  stat: "critRate"
});

const CONCENTRACION_CRIT_DMG = new StatModifier({
  nombre: "concentración critDamage",
  duracion: 3,
  valorEfecto: 0.5, // +50% daño crítico
  ritmo: "inicio",
  tipo: "buff",
  stat: "critDamage"
});

const VIENTO_AFIN_VEL = new StatModifier({
  nombre: "viento afín vel",
  duracion: 3,
  valorEfecto: 0.5, // +50% velocidad
  ritmo: "inicio",
  tipo: "buff",
  stat: "vel"
});

const PRECISION_DEBUFF = new StatModifier({
  nombre: "Niebla Negra - Precisión",
  duracion: 3,          // dura 3 turnos
  valorEfecto: 0.25,    // reduce precisión un 25%
  ritmo: "inicio",      // se aplica al inicio del turno
  tipo: "debuff",
  stat: "precision"
});

const RESISTENCIA_DEBUFF = new StatModifier({
  nombre: "Esfera Oscura - Resistencia",
  duracion: 3,
  valorEfecto: 0.3,     // reduce res un 30%
  ritmo: "inicio",
  tipo: "debuff",
  stat: "res"
});

const VELOCIDAD_DEBUFF = new StatModifier({
  nombre: "Nictoplasma - Velocidad",
  duracion: 3,
  valorEfecto: 0.2,     // reduce velocidad un 20%
  ritmo: "inicio",
  tipo: "debuff",
  stat: "vel"
});

const ROMPEBRAZO_DEBUFF = new StatModifier({
  nombre: "Rompebrazo - Ataque",
  duracion: 3,
  valorEfecto: 0.3,    // reduce ataque un 30%
  ritmo: "inicio",
  tipo: "debuff",
  stat: "atq"
});


const QUIEBRAESCUDOS_DEBUFF = new StatModifier({
  nombre: "Quiebraescudos - Defensa",
  duracion: 3,
  valorEfecto: 0.3,    // reduce defensa un 30%
  ritmo: "inicio",
  tipo: "debuff",
  stat: "def"
});

const EMOCION_COMBATE_BUFF_ATQ = new StatModifier({
  nombre: "Emoción de Combate - Ataque",
  duracion: 3,
  valorEfecto: 0.3,
  ritmo: "inicio",
  tipo: "buff",
  stat: "atq"
});

const EMOCION_COMBATE_BUFF_DEF = new StatModifier({
  nombre: "Emoción de Combate - Defensa",
  duracion: 3,
  valorEfecto: 0.3,
  ritmo: "inicio",
  tipo: "buff",
  stat: "def"
});

const EMOCION_COMBATE_BUFF_VEL = new StatModifier({
  nombre: "Emoción de Combate - Velocidad",
  duracion: 3,
  valorEfecto: 0.2,
  ritmo: "inicio",
  tipo: "buff",
  stat: "vel"
});

const DEBILITAR_NIEBLA = new StatModifier({
  nombre: "Debilitar",
  duracion: 3,
  valorEfecto: 0.3,
  ritmo: "inicio",
  tipo: "debuff",
  stat: "res"
})


const MODIFIER_MANAGER = {
  stats: [
    "atq",
    "def",
    "magia",
    "res",
    "vel",
    "critRate",
    "critDamage"
  ],

  reducirModifier(personaje, tipoModifier, ritmo){
    this.stats.forEach(stat => {
      // Reducir duración de cada modificador según ritmo
      personaje[tipoModifier][stat].forEach(m => {
        if (m.ritmo === ritmo) {
          m.duracion--;
        }
      });

      // Limpiar modificadores expirados
      this._deleteModifier(personaje, tipoModifier, stat);
    });
  },

  _deleteModifier(personaje, tipoModifier, stat){
    personaje[tipoModifier][stat] = personaje[tipoModifier][stat].filter(m => m.duracion > 0);
  }
}

export {
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
  VIENTO_CORTANTE_MODIFIER,
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
}
