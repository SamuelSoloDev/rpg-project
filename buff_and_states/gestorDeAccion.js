const actionManager = {
  aliados: null,
  enemigos: null,

  get aliadosVivos() {
    return this.aliados.filter(p => p.vivo);
  },

  get enemigosVivos() {
    return this.enemigos.filter(p => p.vivo);
  },


  obtenerJugadores(aliados, enemigos){
    this.aliados = aliados;
    this.enemigos = enemigos;
    console.log("###############################################################");
    console.log("###############################################################");
    console.log(`ALIADOS:   ${this.aliados}`);
    console.log(`ENEMIGOS: ${this.enemigos}`);




  },
  obtenerPosiblesObjetivos(personaje, accion) {
    let naturaleza = null;
    let grupo = personaje.grupo;
    //console.log(accion.naturaleza); //

    //el problema empieza por acá
    if (typeof accion === 'string') {
      //console.log("es string");

      naturaleza = accion;
    }
    if (typeof accion === 'object') {
      //console.log("es objeto");
      naturaleza = accion.naturaleza;
     // console.log(accion.naturaleza);
    }
    //console.log(accion); //

    const mapa = {
      aliado: {
        ofensivo: this.enemigosVivos,
        defensivo:  this.aliadosVivos,
        soporte:  this.aliadosVivos
      },
      enemigo: {
        ofensivo:  this.aliadosVivos,
        defensivo:  this.enemigosVivos,
        soporte:  this.enemigosVivos
      }
    };

    const posibles = mapa[grupo]?.[naturaleza];

    if (!posibles) {
      throw new Error(`No se pudieron determinar los objetivos para la acción de tipo '${naturaleza}' del grupo '${grupo}'`);
    }

    return posibles;
  },


};

export {actionManager}
