

class statModifier {
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


const PRISA = new statModifier({
  nombre: "prisa",
  duracion: 3,
  valorEfecto: 1,
  ritmo: "final",
  tipo: "buff",
  stat: "vel"
})

const FRENO = new statModifier({
  nombre: "freno",
  duracion: 2,
  valorEfecto: 1,
  ritmo: "inicio",
  tipo: "debuff",
  stat: "vel"
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


  _buscarBuff(personaje){
    let buff = null;
    this.stats.forEach( stat => {
      if (personaje.buff[stat].length) {

      }
    }

    )
  }
}

export { MODIFIER_MANAGER, PRISA, FRENO}