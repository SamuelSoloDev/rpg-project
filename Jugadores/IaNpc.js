import { ataque, curar } from "../abilities.js";
import { elementoAleatorio } from "../main.js";
import { NPC } from "./personaje.js";
import  turnManager  from "../turnManager.js";
import actionManager from "../gestorDeAccion.js";



const personalidad = {
  fulminador: {
    prioridades: {
      rematar: "MAX",
      sobrevivir: "MID",
      lastimar: "LOW"
    },
    estilo: {
      tipoFav: "ataque",
      tipoDanoFav: "fisico"
    }
  }
};


function hayObjetivoDebil(lista) {
  return lista.some(personaje => personaje.vida <= 30);
}

function rematar(lista, npc) {
  if (hayObjetivoDebil(lista)) {
    return iaNpc.buscarAccion(npc, "ofensivo");
  }
}

function estoyDebil(npc) {
  return npc.vida <= 50;
}

function sobrevivir(lista, npc) {
  lista; //la guardo acá aunque no la use (deuda tecnica para más tarde sólo
  // por que no se me ocurre una manera eficiente de usarla)
  if (estoyDebil(npc)) {
    return iaNpc.buscarAccion(npc, "defensivo")
  }
}

function lastimar(lista, npc) {
  lista; //la guardo acá aunque no la use (deuda tecnica para más tarde sólo
  // por que no se me ocurre una manera eficiente de usarla)
  return iaNpc.buscarAccion(npc, "ofensivo")
}

function objetivoMasDebil(lista) {
  let enemigo = null;
  lista.forEach(personaje => {
    console.log(`${personaje.nombre}`);
    if (enemigo == null) {
      enemigo = personaje;
      console.log("pasó de null a numero");
    } else if (personaje.vida <= enemigo.vida) {
      enemigo = personaje;
      console.log("el resultado de enemigo cambió");
    }
  });
  return enemigo;
}

const filtrosDeBusqueda = {
  rematar: {
    accion: (lista, npc) => rematar(lista, npc),
    tipoDeAccion: "ofensivo",
  },
  sobrevivir: {
    accion: (lista, npc) => sobrevivir(lista, npc),
    tipoDeAccion: "defensivo",
  },
  lastimar: {
    accion: (lista, npc) => lastimar(lista, npc),
    tipoDeAccion: "ofensivo"
  }
};


const iaNpc = {
  buscarAccion(npc, naturaleza) {
   // Busca la accion tomando cómo párametros una instancia del tipo "jugadores"
  //  y un string que diga la "naturaleza" que se desea de la accion.
  /* --IMPORTANTE--
   es cómo un buscador generico de acciones, su lógica le permite ser reutilizable,
   actualmente se usa para los filtros de busqueda de la lista.
  */

  let perfil = personalidad[npc.comportamiento];
  let acciones = npc.acciones.filter(
    a => a?.accion?.tipo === perfil?.estilo?.tipoFav && a?.accion?.naturaleza === naturaleza
  );
  console.log(acciones);
  // Si para este punto "acciones" está vacío, se asume que
  // ninguna acción del npc coincide del todo con su estilo favorito
  // no obstante, aún tiene prioridades...
  if (acciones.length === 0) {
    acciones = npc.acciones.filter(a => a?.accion?.naturaleza === naturaleza);
    console.log(acciones);

  }

  //por ahora (y para no hacer más complicado el código), la accion elegida
  // será aleatoria, luego se añadirá más lógica para la ia cuando avance el proyecto.
  let accionElegida = elementoAleatorio(acciones);

  console.log(accionElegida);
  //retorna la accion resultante
  return accionElegida;
},

npcPrioridades(npc) {
  //pretende buscar las prioridades
  return personalidad[npc.comportamiento].prioridades;
},

buscarPrioridad(lista, nivelPrioridad) {
  let prioridad = null;
  for (const propiedad in lista) {
    if (lista[propiedad] === nivelPrioridad) {
      prioridad = `${propiedad}`;
      console.log(propiedad);
      console.log(lista[propiedad]);
      console.log(nivelPrioridad);
    }
  }
  console.log(prioridad);
  return prioridad;
},

elegirAccion(npc) {
  let accionElegida = null;
  let personalidad = this.npcPrioridades(npc);
  console.log(personalidad);
  let maximaPrioridad = this.buscarPrioridad(personalidad, "MAX");
  console.log(maximaPrioridad); //aquí dice perfectamente que tiene un valor (el cual es "rematar")

  if (maximaPrioridad) //para este punto, por alguna razon, maximaPrioridad es undefined y no entiendo por qué
     {
    let lista = actionManager.obtenerPosiblesObjetivos(npc, filtrosDeBusqueda[maximaPrioridad].tipoDeAccion)
    console.log(lista);

    accionElegida = filtrosDeBusqueda[maximaPrioridad].accion(lista, npc);
    console.log(accionElegida);
    if (accionElegida) {
      return accionElegida;
    }
  }

  let mediaPrioridad = this.buscarPrioridad(personalidad, "MID")

  if (mediaPrioridad) {
    console.log(filtrosDeBusqueda[mediaPrioridad].tipoDeAccion);
    let lista = actionManager.obtenerPosiblesObjetivos(npc, filtrosDeBusqueda[mediaPrioridad].tipoDeAccion)
    console.log(lista);

    accionElegida = filtrosDeBusqueda[mediaPrioridad].accion(lista, npc);
    console.log(accionElegida);
    if (accionElegida) {
      return accionElegida;
    }
  }

  let bajaPrioridad = this.buscarPrioridad(personalidad, "LOW")
  if (bajaPrioridad) {
    let lista = actionManager.obtenerPosiblesObjetivos(npc, filtrosDeBusqueda[bajaPrioridad].tipoDeAccion)
    console.log(lista);

    accionElegida = filtrosDeBusqueda[bajaPrioridad].accion(lista, npc);
    console.log(accionElegida);
    if (accionElegida) {
      return accionElegida;
    }
  }
}


}

export default iaNpc