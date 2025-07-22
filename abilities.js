class Habilidad {
  constructor({
    nombre,
    efecto = ()=> {console.log("Wow, aquí no hay nada")},
    costo = 0,
    elemento = "fisico",
    escalado = 1,
    naturaleza = "defensivo",
    tipo = "dano",
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
    this.efecto(usuario, objetivo);
  }

}

const ataque = new Habilidad({
  nombre: ataque,
  efecto: function (usuario, objetivo) {
    objetivo.recibirDano(usuario.atq)
  },
  naturaleza: "ofensivo"
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
  escalado: 2
})



export {fireBall, ataque}