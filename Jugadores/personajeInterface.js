import menuPersonaje from "../UI/menuUi.js";
import turnManager from '../turnManager.js';

const pjInterface = {
  equipoAliado: document.getElementById("aliados"),
  equipoEnemigo: document.getElementById("enemigos"),

  agregarAliado(hijo){
    this.equipoAliado.append(hijo);
  },

  _limpiar(){
    this.equipoAliado.textContent = "";
    this.equipoEnemigo.textContent = "";
  },

  agregarEnemigo(hijo){
    this.equipoEnemigo.append(hijo);
  },

  renderAliado(){

    turnManager.aliados.forEach(
    (ally) => { this.agregarAliado(this.renderizarPj(ally))
      actualizarUi.vitBar(ally);
    }
    )
  },

  renderEnemigo(){
    turnManager.enemigos.forEach(
      (enemie) => {this.agregarEnemigo(this.renderizarPj(enemie))
      actualizarUi.vitBar(enemie);
      }
    )
  },

  renderizarPj(pj){
      const pjContainer = document.createElement("li");
      pjContainer.textContent = `${pj.nombre}`;
      pjContainer.id = pj.nombre;
      pjContainer.append(
        this.renderVitBar(pj),
        this.renderChargeBar(pj)
      )
      return pjContainer;
  },


  renderVitBar(personaje){
    const hpBar = document.createElement("div");

    hpBar.classList.add("hpBar", `hp--${personaje.nombre}`, "bar");

    return hpBar;
  },

  renderChargeBar(personaje){
    const chargeBar = document.createElement("div");
    chargeBar.classList.add("chargeBar", `charge--${personaje.nombre}`, "bar");
    return chargeBar;
  },
  renderAllPj(){
    this._limpiar()
    this.renderAliado();
    this.renderEnemigo();
  }
}


const actualizarUi = {

  vitBar(personaje){
    const hpBar = document.querySelector(`.hp--${personaje.nombre}`)
    hpBar.textContent = personaje.vida;
    hpBar.style.width = `${parseFloat(((personaje.vida / personaje.maxVida) * 100).toFixed(2))}%`;
  },

  chargeBar(personaje){
    const chargeBar = document.querySelector(`.charge--${personaje.nombre}`)
    chargeBar.style.width = `${parseFloat(((personaje.carga / 100) * 100).toFixed(2))}%`
  }
}

export {pjInterface, actualizarUi}