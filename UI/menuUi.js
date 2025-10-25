import {actionManager}  from "../buff_and_states/gestorDeAccion.js";


const menuPersonaje = {
  get menu() { return document.getElementById("actionMenu"); },
  get nombre() { return document.getElementById("menu--name"); },
  get mp() { return document.getElementById("menu--mp"); },
  menuDeOpcionesPrincipal: null,

  _elementosDisponibles() {
    return this.menu && this.nombre && this.mp;
  },

  _limpiar() {
    if (!this.menu) return;
    this.menu.innerHTML = "";
  },

  _agregar(...hijos) {
    if (!this.menu) return;
    hijos.forEach(hijo => this.menu.append(hijo));
  },

  async uiPersonaje(personaje) {
    if (!this._elementosDisponibles()) return; // 👈 protección

    this._limpiar();
    return new Promise((resolve) => {
      this.nombre.textContent = personaje.nombre;
      this.mp.textContent = `${personaje.mana}/${personaje.base.mana}`;
      let resultado = this._imprimirBotones(personaje.opciones, personaje, false);
      resolve(resultado);
    });
  },

  async uiSelector(array) {
    if (!this.menu) return; // 👈 protección
    this._limpiar();

    return new Promise((resolve) => {
      array.forEach((objetivo) => {
        const boton = document.createElement("button");
        boton.textContent = objetivo.nombre;
        boton.classList.add("option", "botonMenu");
        boton.addEventListener("click", () => {
          this._limpiar();
          resolve(objetivo);
        });
        this._agregar(boton);
      });
    });
  },

  _imprimirBotones(opciones, personaje, volver) {
    if (!this.menu) return; // 👈 protección

    if (!volver) {
      this.menuDeOpcionesPrincipal = personaje;
    }

    return new Promise((resolve) => {
      let hayBotonVolver = volver;
      let btnVolver = this._botonRetorn(this.menuDeOpcionesPrincipal, resolve);
      btnVolver.id = "btn--volver";

      opciones.forEach((opcion) => {
        const btn = document.createElement("button");
        btn.classList.add("botonMenu", "option");
        btn.textContent = opcion.texto;
        btn.classList.add(opcion.texto.replaceAll(" ", ""));

        if (opcion.valor?.costo !== undefined && opcion.valor.costo > personaje.mana) {
          btn.addEventListener("click", () => alert("No tienes mana para esto"));
          btn.classList.add("nopuede");
        } else {
          btn.addEventListener("click", async () => {
            this._limpiar();
            if (opcion.subopciones) {
              const resultado = await this._imprimirBotones(opcion.subopciones, personaje, true);
              resolve(resultado);
            } else {
              resolve(opcion.valor);
            }
          });
        }
        this._agregar(btn);
      });

      if (hayBotonVolver) {
        this._agregar(btnVolver);
      }
    });
  },

  _botonRetorn(personaje, resolve) {
    const botonRetorno = document.createElement("button");
    botonRetorno.classList.add("botonMenu", "option");
    botonRetorno.textContent = "Volver";
    botonRetorno.addEventListener("click", async () => {
      this._limpiar();
      const resultado = await this._imprimirBotones(personaje.opciones, personaje, false);
      resolve(resultado);
    });
    return botonRetorno;
  },

  esperarTurno() {
    if (!this.menu) return; // 👈 protección
    this._limpiar();

    const msj = document.createElement("h1");
    msj.classList.add("msjEspera");
    msj.textContent = "Esperando el siguiente turno";
    this._agregar(msj);
  }
};

export default menuPersonaje;
