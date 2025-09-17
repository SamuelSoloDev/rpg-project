import turnManager from "../turnManager.js";

class Status {
  constructor({
    nombre,
    duracion,
    efecto,
    ritmo,
  }) {
    this.nombre = nombre;
    this.duracion = duracion;
    this.efecto = efecto;
    this.ritmo = ritmo;
    this.datos = {
      nombre,
      duracion,
      efecto,
      ritmo
    }
  }

  aplicarEstado(personaje){

    if (personaje.status[this.nombre]) {
      console.log("El personaje ya tiene este estado");
      return;
    }
    personaje.status[this.nombre] = this.datos;

  }

}

const CONGELAR = new Status({
  nombre: "congelar",
  duracion: 2,
  efecto: function (personaje) {
    console.log(`${personaje.nombre} está congelado`);
    turnManager.terminarTurno(personaje);
  },
  ritmo: "inicio"
});

const VENENO = new Status({
  nombre: "Veneno",
  duracion: 2,
  efecto: function (personaje) {
     let damage = personaje.vida * 0.15;
    personaje.recibirDamage(damage);
  },
  ritmo: "final"
});

const QUEMADURA = new Status({
  nombre: "Quemadura",
  duracion: 5,
  efecto: function (personaje) {
    let damage = 10 + (personaje.vida * 0.05)
    personaje.recibirDamage(damage)
    console.log(`Me han quemado  ahora tengo ${personaje.vida} de vida`);

  },
  ritmo: "final"
})

const SANGRADO = new Status({
  nombre: "Sangrado",
  duracion: 4,
  efecto: function (personaje) {
    let damage = 5 + personaje.vida * 0.10;
    personaje.recibirDamage(damage);
  }
});

const PROVOCAR = new Status({
  nombre: "Provocar",
  duracion: 2,
  efecto: function (personaje) {
    console.log("actualmente, mi arquitectura no permite un efecto similar `provocar` unu");
  },
  ritmo: "final"
})

const STATUS_MANAGER = {
  checkStatus(personaje, ritmo){
    let estados = this._buscarEstados(personaje, ritmo);
    console.log(personaje.status[estados.nombre]);

    if (Object.keys(estados).length === 0) {
      console.log("no hay nada");
      return
    }

    this._ejecutarEstados(personaje, estados);

    this._reducirDuracionDeEstados(personaje, estados);

  },

  _buscarEstados(personaje, ritmo){

    let filtrado = Object.entries(personaje.status).reduce((acumulador, [nombre, datos]) =>
       {
        if (datos.ritmo === ritmo) {
          acumulador[nombre] = datos;
        }
        return acumulador;
      }, {});
      return filtrado
    },

  _ejecutarEstados(personaje, lista) {
    for (const clave in lista) {
      let estado = lista[clave];  // el objeto con {nombre, duracion, efecto, ritmo}

    if (typeof estado.efecto === "function") {
      estado.efecto(personaje);
    }
  }
},
  _reducirDuracionDeEstados(personaje, lista){
    for (const clave in lista) {
      let estado = lista[clave];
      console.log(estado);

      if (personaje.status[estado.nombre].duracion > 0) {
        personaje.status[estado.nombre].duracion--;
      } else if (personaje.status[estado.nombre].duracion <= 0) {
        this._limpiarEstado(personaje, estado.nombre)
      }
    }
  },
  _limpiarEstado(personaje, nombre){
    if (personaje.status[nombre]) {
      console.log(`El estado ${nombre}, será borrado`);

      delete personaje.status[nombre];
      console.log(`El estado ${nombre}, ha sido borrado`);
      console.log(personaje.status);

    }
  }
}

export {CONGELAR, VENENO, STATUS_MANAGER, PROVOCAR, QUEMADURA, SANGRADO}