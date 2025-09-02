class Habilidad {
  constructor({
    nombre,
    efecto = ()=> {console.log("Wow, aquí no hay nada")},
    costo = 0,
    elemento = "fisico",
    escalado = 1,
    naturaleza = "defensivo",
    tipo = "habilidad",
    tipoDeDano = "fisico",
    rango = "unico",
    precision = 100,
    nivel = 1,
    probEfecto = 0,
  }) {
    this.nombre = nombre;
    this.efecto = efecto;
    this.costo = costo;
    this.tipoDeDano = tipoDeDano;
    this.elemento = elemento;
    this.escalado = escalado;
    this.naturaleza = naturaleza;
    this.tipo = tipo;
    this.rango = rango;
    this.precision = precision;
    this.nivel = nivel;
    this.probEfecto = probEfecto;
  }

  obtenerDescripcion() {
    return `${this.nombre} (${this.tipo}) cuesta ${this.costo} PM y tiene ${this.precision}% de acierto.`;
  }
  usar(usuario, objetivo){
      usuario.mana -= this.costo;
      console.log(`Se gastó el maná de ${usuario.nombre} y ahora tiene ${usuario.mana} de maná!`);
    this.efecto(usuario, objetivo);
  }

}

const ataque = new Habilidad({
  nombre: "ataque",
  efecto: function (usuario, objetivo) {
     if (!objetivo || typeof objetivo.recibirDamage !== "function") {
    console.error("El objetivo no es válido o no tiene recibirDamage()", objetivo);
    return;
  }
    objetivo.recibirDamage(usuario.atq)
  },
  naturaleza: "ofensivo",
  tipo: "ataque"
})

const fireBall = new Habilidad({
  nombre: "Fire Ball",
  efecto: function (usuario, objetivo){
    usuario.mana -= this.costo;
    console.log(`${usuario.nombre} ha perdido ${this.costo} de Mana`)
    objetivo.vida -= usuario.magia * this.escalado;
    console.log("AHHH ME HAN QUEMADO")
  },
  costo: 10,
  escalado: 2,
  tipo: "magia"
})

const curar = new Habilidad({
  nombre: "curar",
  efecto: function (usuario, objetivo) {
    objetivo.vida += usuario.magia * this.escalado;
    console.log(`${objetivo.nombre} se ha curado`);
  },
  escalado:1.5,
  tipo: "magia",
  naturaleza: "defensivo",
  costo: 20
})



export {fireBall, ataque, curar}