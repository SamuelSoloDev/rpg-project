import {reiniciar, comenzar} from '../main.js';

const screen = {
  pantalla: document.getElementById("screen"),

  limpiar(){
    this.pantalla.textContent = "";
  },
  inicio(){
    const titulo = document.createElement("h1");
    titulo.textContent = "THE CODEX RIFT";
    const boton = this._botonEmpezar();
     this._abierta(titulo, boton);
  },

  reinicio(){
    const titulo = document.createElement("h1");
    titulo.textContent = "¿Volver a intentar?";
    const boton = this._botonReiniciar();
    this._abierta(titulo, boton);
  },

  _abierta(titulo, boton){
    this.limpiar();

    this.pantalla.classList.remove("oculto");
    this.pantalla.classList.add("screen-open");
    this.pantalla.append(titulo, boton);
  },

  _botonEmpezar(){
    const boton = document.createElement("button");

    boton.textContent = "¡EMPIEZA!";

    boton.addEventListener("click", () => {
      this.limpiar();
      this.pantalla.classList.remove("screen-open")
      this.pantalla.classList.add("oculto");
      comenzar();
    } )

    boton.classList.add("button--start")

    return boton;
  },

  _botonReiniciar(){
     const boton = document.createElement("button");

    boton.textContent = "¿Reiniciar?";

    boton.addEventListener("click", () => {
      this.limpiar();
      this.pantalla.classList.remove("screen-open")
      this.pantalla.classList.add("oculto");
      reiniciar();
    } )

    boton.classList.add("button--start")

    return boton;
  }
}

export default screen;