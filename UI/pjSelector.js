import { heroes } from "../main.js";

const COMPONENT_MANAGER = {
  base: document.getElementById("base"),
  elegidos: [],

  renderizarMenuDeSeleccion(){
    this._crearListaDePersonajes();
    this._crearListaDeElegidos();
  },

  _agregar(elemento){
    this.base.appendChild(elemento);
  },

  _crearListaDePersonajes(){
    let personajeContainer = document.createElement("ul")

    personajeContainer.id = "personajes";
    this._agregar(personajeContainer);

    this._agregarPersonajes(heroes, personajeContainer.id);
  },

  _crearListaDeElegidos(){
    let elegidosContainer = document.createElement("ul");

    elegidosContainer.id = "elegidos";

    this._botonBorrarElegidos();
    elegidosContainer.appendChild(this._botonBorrarElegidos())

    this._agregar(elegidosContainer);
  },

  _agregarPersonajes(lista, tipoContainer){
    let listaHeroes = document.getElementById(`${tipoContainer}`);
    listaHeroes.innerHTML = "";
    lista.forEach(heroe => {

      let liHeroe = document.createElement("li");

      liHeroe.id = `${heroe}--${tipoContainer}`;
      console.log(liHeroe.id);

      liHeroe.textContent = heroe;

      liHeroe.classList.add("heroe")
      if (tipoContainer === "personajes") {
        this._crearBotones(heroe, liHeroe);
      }
      listaHeroes.appendChild(liHeroe);
    })
    if (tipoContainer === "elegidos") {
      listaHeroes.appendChild(this._botonBorrarElegidos())
    }
  },

  _crearBotones(heroe, heroeComponente){
    let boton = document.createElement("button");

    boton.classList.add(`botonAgregar`)
    boton.id = `boton--${heroe}`
    boton.textContent = "Agregar"

    boton.addEventListener("click", () => {
      this._elegirHeroe(heroe);
      this._agregarPersonajes(this.elegidos, "elegidos")
      this.checkComponentStatus();
    })
    heroeComponente.appendChild(boton);
  },

  _elegirHeroe(heroe){
    if (this.elegidos.length < 4) {
      this.elegidos.push(heroe);
    } else {
      alert("Ya está completa la party")
    }
  },

  checkComponentStatus(){
    heroes.forEach( heroe => {
      let heroeElegido = this.elegidos.some(elegido => elegido === heroe);
      let boton = document.getElementById(`boton--${heroe}`)

      if (heroeElegido === true) {
        boton.disabled = true;
      } else {
        boton.disabled = false;
      }
    })
  },

  _botonBorrarElegidos(){
    let boton = document.createElement("button");
    boton.textContent = "Rehacer";
    boton.addEventListener("click", ()=> {
      this.elegidos.length = 0;
      this.checkComponentStatus()
      this._agregarPersonajes(this.elegidos, "elegidos");
    })
    return boton;
  }

}
