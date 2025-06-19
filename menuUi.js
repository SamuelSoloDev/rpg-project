import {aver, esTurno} from './main.js';

const menuPersonaje = {
  //agregar el menú
  menu : document.getElementById("actionMenu"),

  //limpiar el menú
  limpiar(){
    this.menu.innerHTML = "";
  },

  agregar(hijo){
    this.menu.append(hijo);
  },

  uiPersonaje(personaje){
    this.limpiar();
      //crear el elemento relacionado al nombre del personaje
  const nombre = document.createElement("h1");
  nombre.classList.add("nombre");
  nombre.textContent = `${personaje.nombre}`;

  //crear el botón

  const atqBtn = document.createElement("button");

  atqBtn.classList.add("ataqueBtn");
  atqBtn.textContent = "Ataca";
  atqBtn.addEventListener("click", () => {esTurno(personaje)})
  this.menu.append(nombre, atqBtn)
  },

  uiSelector(array){
    this.limpiar();

    return new Promise((resolve, reject) => {
       array.forEach((objetivo) => {
         const boton = document.createElement("button");
         boton.textContent = objetivo.nombre;
         boton.addEventListener(
          'click', () => {
           this.limpiar;
           resolve(objetivo);
         });
         this.agregar(boton);
       });
    });

  },

  esperarTurno(){
    this.limpiar();
    const msj = document.createElement("h1");
    msj.textContent = "Esperando el siguiente turno"
    this.agregar(msj);
  }
}

export default menuPersonaje;


/*
function invocarBestia() {
  return new Promise((resolve, reject) => {
    setTimeout(()=> {
      resolve("LA BESIA AH SIDO INVOCADA")
    }, 3000);
  });

  invocarBestia().then(
    (mensaje) => {console.log(mensaje);

    }).catch(error => {console.log("Error", error);
      });
*/