const heroes = [
  { nombre: "Masamune", clase: "Asesino", retrato: "Masamune.png" },
  { nombre: "Alblanc", clase: "Clériga", retrato: "Alblanc.png" },
  { nombre: "Kabuto", clase: "Paladin Oscuro", retrato: "Kabuto.png" },
  { nombre: "Nicanora", clase: "Arquera", retrato: "Nicanora.png" },
  { nombre: "Raissa", clase: "Hechicera", retrato: "Raissa.png" },
  { nombre: "Alexandrius", clase: "Caballero Ígneo", retrato: "Alexandrius.png" }
];


const COMPONENT_MANAGER = {
  base: document.getElementById("base"),
  elegidos: [],

  async renderizarMenuDeSeleccion() {
    this.base.textContent = "";
    this._crearListaDePersonajes();
    const teamElegido = await this._crearListaDeElegidos();

    this.base.textContent= "";
    return this.elegidos;
  },

  _agregar(elemento) {
    this.base.appendChild(elemento);
  },

  _crearListaDePersonajes() {
    const personajeContainer = document.createElement("div");
    personajeContainer.id = "personajes";
    this._agregar(personajeContainer);
    this._agregarPersonajes(heroes, personajeContainer.id);
  },

  async _crearListaDeElegidos() {
    function spanBtn() {
      const spanBtn = document.createElement("span");
      spanBtn.classList.add("spanBtn");
      return spanBtn;
    }


    const elegidosContainer = document.createElement("div");
    elegidosContainer.id = "elegidos";
    this._agregar(elegidosContainer);

    // 🟢 Subcontenedor donde se mostrarán los héroes elegidos
    const listaElegidos = document.createElement("div");
    listaElegidos.id = "lista-elegidos";
    elegidosContainer.appendChild(listaElegidos);

    // 🟢 Contenedor para los botones
    const contenedorBotones = document.createElement("div");
    contenedorBotones.classList.add("contenedor-botones");
    elegidosContainer.appendChild(contenedorBotones);

    // 🟢 Botón Rehacer
    const botonRehacer = this._botonBorrarElegidos();
    botonRehacer.classList.add("btn", "btn--rehacer");
    const spanRehacer = spanBtn();
    botonRehacer.appendChild(spanRehacer)
    contenedorBotones.appendChild(botonRehacer);

    // 🟢 Botón Confirmar
    const btnConfirmar = document.createElement("button");
    btnConfirmar.textContent = "Confirmar";
    btnConfirmar.classList.add("btn", "btn--confirmar");
    const spanConfirmar = spanBtn();
    btnConfirmar.appendChild(spanConfirmar);
    contenedorBotones.appendChild(btnConfirmar);

    // 🔵 Espera a que el usuario confirme
    return new Promise((resolve) => {
      btnConfirmar.addEventListener("click", () => {
        if (this.elegidos.length === 0) {
          alert("No has elegido ningún personaje.");
          return;
        }
        resolve(this.elegidos);
      });
    });
  },

  _agregarPersonajes(lista, tipoContainer) {
    const listaHeroes = document.getElementById(
      tipoContainer === "elegidos" ? "lista-elegidos" : tipoContainer
    );

    listaHeroes.innerHTML = "";

    lista.forEach(heroe => {
      const liHeroe = document.createElement("div");
      liHeroe.id = `${heroe.nombre}--${tipoContainer}`;
      liHeroe.classList.add("heroe");

      // Retrato (imagen)
      const retrato = document.createElement("img");
      retrato.classList.add("retrato", `retrato--${heroe.nombre}`);
      retrato.src = `${heroe.nombre.toLowerCase()}.png`; // ajusta la ruta a tus imágenes
      retrato.alt = heroe.nombre;
      liHeroe.appendChild(retrato);


      liHeroe.appendChild(retrato);

      // Nombre
      const parrafoNombre = this._parrafoNombreHeroe(heroe);
      liHeroe.appendChild(parrafoNombre);

      // Clase
      const parrafoClase = this._parrafoClaseHeroe(heroe);
      liHeroe.appendChild(parrafoClase);

      // Botón agregar solo en la lista principal
      if (tipoContainer === "personajes") {
        this._crearBotones(heroe, liHeroe);
      }

      listaHeroes.appendChild(liHeroe);
    });
  },

  _crearBotones(heroe, heroeComponente) {
    const boton = document.createElement("button");
    boton.classList.add("botonAgregar", "btn");
    boton.id = `boton--${heroe.nombre}`;
    boton.textContent = "Agregar";

    boton.addEventListener("click", () => {
      this._elegirHeroe(heroe);
      this._agregarPersonajes(this.elegidos, "elegidos");
      this.checkComponentStatus();
    });

    heroeComponente.appendChild(boton);
  },

  _elegirHeroe(heroe) {
    if (this.elegidos.length < 4) {
      this.elegidos.push(heroe);
    } else {
      alert("Ya está completa la party");
    }
  },

  checkComponentStatus() {
    heroes.forEach(heroe => {
      const heroeElegido = this.elegidos.some(e => e.nombre === heroe.nombre);
      const boton = document.getElementById(`boton--${heroe.nombre}`);
      if (boton) boton.disabled = heroeElegido;
    });
  },

  _botonBorrarElegidos() {
    const boton = document.createElement("button");
    boton.classList.add("btn", "btn-rehacer");
    boton.textContent = "Rehacer";

    boton.addEventListener("click", () => {
      this.elegidos.length = 0;
      this.checkComponentStatus();
      this._agregarPersonajes(this.elegidos, "elegidos");
    });

    return boton;
  },

  _parrafoNombreHeroe(heroe) {
    const parrafo = document.createElement("p");
    parrafo.textContent = heroe.nombre;
    parrafo.classList.add("nombre-heroe", `nombre--${heroe.nombre}`);
    return parrafo;
  },

  _parrafoClaseHeroe(heroe) {
    const parrafo = document.createElement("p");
    parrafo.textContent = heroe.clase;
    parrafo.classList.add("clase-heroe", `clase--${heroe.nombre}`);
    return parrafo;
  }
};



export {COMPONENT_MANAGER};