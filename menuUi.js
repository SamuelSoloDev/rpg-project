import actionManager  from "./gestorDeAccion.js";

const menuPersonaje = {
  // Agregar el menú
  menu: document.getElementById("actionMenu"),
  nombre: document.getElementById("menu--name"),

  // Limpiar el menú
  _limpiar() {
    this.menu.innerHTML = "";
  },

  // Agregar elemento al menú
  _agregar(...hijos) {
  hijos.forEach(hijo => this.menu.append(hijo));
}
,

  // Mostrar UI del personaje actual
 async uiPersonaje(personaje) {
    this._limpiar();
    return new Promise((resolve) => {
      // agregar el nombre del personaje en el menú.
      this.nombre.textContent = personaje.nombre;

      let resultado = this._imprimirBotones(personaje)
      resolve(resultado);
    })


  },

  // Mostrar selección de objetivos
  async uiSelector(array) {
    this._limpiar();

    return new Promise((resolve) => {
      array.forEach((objetivo) => {
        const boton = document.createElement("button");
        boton.textContent = objetivo.nombre;
        boton.addEventListener("click", () => {
          this._limpiar();
          resolve(objetivo);
        });
        this._agregar(boton);
      });
    });
  },

  _imprimirBotones(personaje){
    return new Promise((resolve) => {
      personaje.opciones.forEach((opcion) =>{
        const btn = document.createElement("button");

        btn.textContent = opcion.texto;

        btn.addEventListener("click", async () => {
        this._limpiar();
          if (opcion.subopciones) {
          // Si hay subopciones, crear otro menú y esperar su resultado
          const resultado = await crearBotonesConPromesa(opcion.subopciones);
          resolve(resultado); // Retornar el valor final desde subopciones
        } else {
          resolve(opcion.valor); // Retornar el valor directamente
        }
      });
      this._agregar(btn);
      } )
    })
  },

  // Mostrar mensaje de espera
  esperarTurno() {
    this._limpiar();

    const msj = document.createElement("h1");
    msj.textContent = "Esperando el siguiente turno";
    this._agregar(msj);
  }
};

export default menuPersonaje;
