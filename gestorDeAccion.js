import turnManager from './turnManager.js';


const actionManager = {
  obtenerPosiblesObjetivos(personaje, accion) {
    const naturaleza = accion.naturaleza;
    const alcance = accion.alcance;
    const grupo = personaje.grupo;

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
