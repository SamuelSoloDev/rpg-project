import menuPersonaje from "../UI/menuUi.js";
import {TurnManager, turnManagerActualContext} from '../turnManager.js';
import { Signal } from "./signals.js";

const pjInterface = {
  equipoAliado: null,
  equipoEnemigo: null,
  aliados: null,
  enemigos: null,

  actualizarReferencias() {
    this.equipoAliado = document.getElementById("aliados");
    this.equipoEnemigo = document.getElementById("enemigos");
  },

  _disponible() {
    // Comprueba si los elementos base siguen existiendo
    if (!document.body.contains(this.equipoAliado) || !document.body.contains(this.equipoEnemigo)) {
      this.actualizarReferencias();
    }
    return this.equipoAliado && this.equipoEnemigo;
  },

  _limpiar() {
    if (!this._disponible()) return;
    this.equipoAliado.textContent = "";
    this.equipoEnemigo.textContent = "";
  },

  agregarAliado(hijo) {
    if (!this._disponible()) return;
    this.equipoAliado.append(hijo);
  },

  agregarEnemigo(hijo) {
    if (!this._disponible()) return;
    this.equipoEnemigo.append(hijo);
  },

  renderAliado() {
    if (!this._disponible()) return;
    this.aliados.forEach((ally) => {
      const nodo = this.renderizarPj(ally);
      if (!nodo) return;
      this.agregarAliado(nodo);

      // Evita errores si actualizarUi ya no puede acceder al DOM
      if (typeof actualizarUi?.vitBar === "function") actualizarUi.vitBar(ally);
      if (typeof actualizarUi?.shieldBar === "function") actualizarUi.shieldBar(ally);
    });
  },

  renderEnemigo() {
    if (!this._disponible()) return;
    this.enemigos.forEach((enemy) => {
      const nodo = this.renderizarPj(enemy);
      if (!nodo) return;
      this.agregarEnemigo(nodo);

      if (typeof actualizarUi?.vitBar === "function") actualizarUi.vitBar(enemy);
      if (typeof actualizarUi?.shieldBar === "function") actualizarUi.shieldBar(enemy);
    });
  },

  renderizarPj(pj) {
    if (!pj) return null;

    const pjContainer = document.createElement("li");
    pjContainer.id = pj.nombre;
    pjContainer.classList.add("personaje");

    const nameTag = document.createElement("p");
    nameTag.textContent = pj.nombre;
    nameTag.classList.add("nameTag");

    pjContainer.append(
      this.renderSpriteCanvas(pj),
      nameTag,
      this.renderSpanDamage(pj),
      this.renderVitBar(pj),
      this.renderShieldBar(pj),
      this.renderChargeBar(pj)
    );

    return pjContainer;
  },

  renderSpanDamage(pj) {
    const spanDamage = document.createElement("span");
    spanDamage.classList.add("spanDamage", `spanDamage--${pj.nombre}`);
    return spanDamage;
  },

  renderVitBar(pj) {
    const hpBarContainer = this.renderBarContainer("hp");
    const hpBar = document.createElement("div");
    hpBar.classList.add("hpBar", `hp--${pj.nombre}`, "bar");
    hpBarContainer.appendChild(hpBar);
    return hpBarContainer;
  },

  renderShieldBar(pj) {
    const shieldBar = document.createElement("div");
    shieldBar.classList.add("shieldBar", `shield--${pj.nombre}`, "bar");
    return shieldBar;
  },

  renderChargeBar(pj) {
    const chargeBarContainer = this.renderBarContainer("charge");
    const chargeBar = document.createElement("div");
    chargeBar.classList.add("chargeBar", `charge--${pj.nombre}`, "bar");
    chargeBarContainer.appendChild(chargeBar);
    return chargeBarContainer;
  },

  renderBarContainer(barType) {
    const bar = document.createElement("div");
    bar.classList.add("barContainer", `barContainer--${barType}`);
    return bar;
  },

  renderAllPj(aliados, enemigos) {
    this.aliados = aliados;
    this.enemigos = enemigos;
    this._limpiar();
    this.renderAliado();
    this.renderEnemigo();
  },

  renderSpriteCanvas(personaje) {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    canvas.classList.add("spriteCanvas", `sprite--${personaje.nombre}`, `${personaje.grupo}`);
    canvas.style.imageRendering = "pixelated";
    canvas.style.backgroundColor = "transparent";

    const ctx = canvas.getContext("2d");

    if (!personaje.sprite) return canvas;

    const img = new Image();
    img.src = personaje.sprite;

    img.onload = () => this._dibujarSprite(ctx, img);
    img.onerror = () =>
      console.warn(`⚠️ No se encontró sprite para ${personaje.nombre}: ${img.src}`);

    return canvas;
  },

  _dibujarSprite(ctx, img) {
    const { width, height } = ctx.canvas;
    const escala = Math.min(width / img.width, height / img.height);
    const x = (width - img.width * escala) / 2;
    const y = (height - img.height * escala) / 2;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, x, y, img.width * escala, img.height * escala);
  },
};




const actualizarUi = {
  vitBar(personaje) {
    const hpBar = document.querySelector(`.hp--${personaje.nombre}`);
    if (!hpBar) return; // seguridad

    hpBar.textContent = "";
    const hpValue = document.createElement("p");
    hpValue.classList.add("hpValue");
    hpValue.textContent = `${personaje.vida} / ${personaje.maxVida}`;
    hpBar.append(hpValue);

    hpBar.style.width = `${parseFloat(
      ((personaje.vida / personaje.maxVida) * 100).toFixed(2)
    )}%`;
  },

  chargeBar(personaje) {
    const chargeBar = document.querySelector(`.charge--${personaje.nombre}`);
    if (!chargeBar) return; // 👈 evita el error cuando no existe

    chargeBar.style.width = `${parseFloat(
      ((personaje.carga / 100) * 100).toFixed(2)
    )}%`;
  },

  shieldBar(personaje) {
    const shieldBar = document.querySelector(`.shield--${personaje.nombre}`);
    if (!shieldBar) return; // seguridad

    shieldBar.textContent = `🛡️ ${personaje.escudo}`;
    const porcentaje = Math.min(100, (personaje.escudo / personaje.maxVida) * 100);
    // podrías usar porcentaje si luego le das ancho visual
  },

  animarDamage(usuario, daño) {
    const SpanDamage = document.querySelector(`.spanDamage--${usuario.nombre}`);
    if (!SpanDamage) return; // 👈 seguridad

    const renderDamage = document.createElement("span");
    renderDamage.classList.add("animation--damage");
    renderDamage.textContent = daño;
    SpanDamage.appendChild(renderDamage);

    setTimeout(() => {
      if (document.body.contains(SpanDamage)) SpanDamage.textContent = "";
    }, 800);
  },

  signalAnimarDamage: new Signal({
    nombre: "Animar Daño",
    ejecutar: ({ usuario, daño }) => {
      actualizarUi.animarDamage(usuario, daño);
    },
    tipoSeñal: "onTakeDamage",
  }),

  signalActualizarVida: new Signal({
    nombre: "actualizar barra de vida",
    ejecutar: ({ usuario }) => actualizarUi.vitBar(usuario),
    statsPropios: null,
    tipoSeñal: "onVidaChange",
  }),

  signalActualizarEscudo: new Signal({
    nombre: "actualizar barra de escudo",
    ejecutar: ({ usuario }) => actualizarUi.shieldBar(usuario),
    statsPropios: null,
    tipoSeñal: "onShieldChange",
  }),
};


const combatInterface = {
  // 🔹 Crea toda la estructura del combate
  renderCombate() {
    /* */
    const combate = document.createElement("div");
    combate.id = "combate";
    combate.classList.add("combate");

    combate.append(
      this.renderNarrador(),
      this.renderEquipos(),
      this.renderFooterMenu()
    );

    document.body.append(combate);
    document.body.classList.add("bg--battle")
    // Notifica al pjInterface para actualizar sus referencias DOM
    pjInterface.actualizarReferencias();
  },

  // 🔹 Renderiza el título del narrador
  renderNarrador() {
    const narrador = document.createElement("h1");
    narrador.id = "narrador";
    narrador.textContent = "Narrador";
    return narrador;
  },

  renderEquipos(){
    const div = document.createElement("div");
    div.id = "teamContainer";

    div.append(
      this.renderEquipoAliado(),
      this.renderEquipoEnemigo()
    )
    return div;
  },

  // 🔹 Renderiza la lista de aliados
  renderEquipoAliado() {
    const ul = document.createElement("ul");
    ul.id = "aliados";
    ul.classList.add("team-holder");

    const titulo = document.createElement("h2");
    titulo.textContent = "Aliados";
    ul.append(titulo);

    return ul;
  },

  // 🔹 Renderiza la lista de enemigos
  renderEquipoEnemigo() {
    const ul = document.createElement("ul");
    ul.id = "enemigos";
    ul.classList.add("team-holder");

    const titulo = document.createElement("h2");
    titulo.textContent = "Enemigos";
    ul.append(titulo);

    return ul;
  },

  // 🔹 Renderiza el footer del menú
  renderFooterMenu() {
    const footer = document.createElement("footer");
    footer.id = "menu";

    const name = document.createElement("h1");
    name.id = "menu--name";
    name.classList.add("menu--text")

    const mp = document.createElement("h2")
    mp.id = "menu--mp";
    mp.classList.add("mp")
    mp.classList.add("menu--text")

    const actionMenu = document.createElement("div");
    actionMenu.id = "actionMenu";
    actionMenu.classList.add("menu");

    footer.append(name, mp, actionMenu,);
    return footer;
  },
};

export {pjInterface, actualizarUi, combatInterface}