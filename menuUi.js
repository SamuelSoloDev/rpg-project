import {esTurno, Jugadores} from './main.js';

const menuPersonaje = {
  // Agregar el menú
  menu: document.getElementById("actionMenu"),
  nombre: document.getElementById("menu--name"),

  // Limpiar el menú
  _limpiar() {
    this.menu.innerHTML = "";
  },

  // Agregar elemento al menú
  _agregar(hijo) {
    this.menu.append(hijo);
  },

  // Mostrar UI del personaje actual
  uiPersonaje(personaje) {
    this.limpiar();

    // agregar el nombre del personaje en el menú.
    nombre.textContent = personaje.nombre;

    // Crear el botón de ataque
    const atqBtn = document.createElement("button");
    atqBtn.classList.add("ataqueBtn");
    atqBtn.textContent = "Ataca";
    atqBtn.addEventListener("click", () => {
      esTurno(personaje);
    });

    this.menu.append(nombre, atqBtn);
  },

  // Mostrar selección de objetivos
  _uiSelector(array) {
    this.limpiar();

    return new Promise((resolve, reject) => {
      array.forEach((objetivo) => {
        const boton = document.createElement("button");
        boton.textContent = objetivo.nombre;
        boton.addEventListener("click", () => {
          this.limpiar();  // <-- Ojo: antes decía this.limpiar sin paréntesis
          resolve(objetivo);
        });
        this.agregar(boton);
      });
    });
  },

  // Mostrar mensaje de espera
  esperarTurno() {
    this.limpiar();

    const msj = document.createElement("h1");
    msj.textContent = "Esperando el siguiente turno";
    this.agregar(msj);
  }
};

export default menuPersonaje;
