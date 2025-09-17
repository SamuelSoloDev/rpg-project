import actionManager  from "../buff_and_states/gestorDeAccion.js";

/* hice este cambio y me salió este error: menuUi.js:110 Uncaught (in promise) ReferenceError: resolve is not defined
    at HTMLButtonElement.<anonymous> (menuUi.js:110:5)
(anónimas)	@	menuUi.js:110 */


const menuPersonaje = {
  // Agregar el menú
  menu: document.getElementById("actionMenu"),
  nombre: document.getElementById("menu--name"),
  menuDeOpcionesPrincipal: null,

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

      let resultado = this._imprimirBotones(personaje.opciones, personaje, false)
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

  _imprimirBotones(opciones, personaje, volver){

    if (volver == false) {
      this.menuDeOpcionesPrincipal = personaje;
    }


    return new Promise((resolve) => {
      let hayBotonVolver = volver;
      let btnVolver = this._botonRetorn(this.menuDeOpcionesPrincipal, resolve)
      opciones.forEach((opcion) =>{
        const btn = document.createElement("button");
        btn.classList.add("botonMenu")
        btn.textContent = opcion.texto;

        if (opcion.valor?.costo !== undefined && opcion.valor?.costo > personaje.mana) {
          console.log(`${opcion.texto} cuesta ${opcion.valor.costo}`);
          btn.addEventListener("click", async () => {
            alert("No tienes mana para esto")
          });

          btn.classList.add("nopuede");
        }
        else {
          btn.addEventListener("click", async () => {
        this._limpiar();
          if (opcion.subopciones) {

          // Si hay subopciones, crear otro menú y esperar su resultado
          const resultado = await this._imprimirBotones(opcion.subopciones, personaje, true);
          resolve(resultado); // Retornar el valor final desde subopciones


        } else {
          console.log(opcion.valor);
          resolve(opcion.valor); // Retornar el valor directamente


        }
      });

    }
      this._agregar(btn);
      } )
    if (hayBotonVolver) {
      this._agregar(btnVolver);
    }
    })
  },

  _botonRetorn(personaje, resolve){
     let botonRetorno = document.createElement("button");
     botonRetorno.classList.add("botonMenu");
     botonRetorno.textContent = "Volver";
     botonRetorno.addEventListener("click", async ()=> {
      this._limpiar();
    // volvemos a imprimir el menú principal
    const resultado = await this._imprimirBotones(personaje.opciones, personaje, false);
    resolve(resultado);
  });
  return botonRetorno;
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
