import turnManager from './turnManager.js';


const actionManager = {
  obtenerPosiblesObjetivos(personaje, accion) {
    let naturaleza = null;
    let grupo = personaje.grupo;
    console.log(accion.naturaleza); //

    //el problema empieza por acá
    if (typeof accion === 'string') {
      console.log("es string");

      naturaleza = accion;
    }
    if (typeof accion === 'object') {
      console.log("es objeto");
      naturaleza = accion.naturaleza;
      console.log(accion.naturaleza);
    }
    console.log(accion); //

    const mapa = {
      aliado: {
        ofensivo: turnManager.enemigosVivos,
        defensivo: turnManager.aliadosVivos,
        soporte: turnManager.aliadosVivos
      },
      enemigo: {
        ofensivo: turnManager.aliadosVivos,
        defensivo: turnManager.enemigosVivos,
        soporte: turnManager.enemigosVivos
      }
    };

    const posibles = mapa[grupo]?.[naturaleza];

    if (!posibles) {
      throw new Error(`No se pudieron determinar los objetivos para la acción de tipo '${naturaleza}' del grupo '${grupo}'`);
    }

    return posibles;
  },


};

export default actionManager;
