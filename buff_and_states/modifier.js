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
}
