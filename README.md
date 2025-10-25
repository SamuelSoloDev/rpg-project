<!-- theme: dark -->

# 🧙‍♂️ Simulador de Combate RPG

**Versión actual:** 0.0.1

Un simulador de combate por turnos en JavaScript inspirado en sistemas de RPG clásicos. Este proyecto busca explorar y construir desde cero mecánicas de combate, gestión de turnos, habilidades, magias y comportamiento de IA.

---

## 🚧 Características Actuales

- ✅ Barra ATB funcional
- ✅ Gestión de turnos y cargas
- ✅ Menús interactivos de acción
- ✅ Comportamiento básico enemigo (ataque aleatorio)
- ✅ Detección de condición de victoria o derrota
- ✅ Feedback visual al hacer daño (numero flotante)
- ✅ Ya hay 6 personajes jugables
- ✅ hay 4 enemigos y un jefe con dos fases
- ✅ Las habilidades funcionan
- ✅ Hay mecanica de escudos
- ✅ Hay formula de daño y críticos
- ✅ Hay selector de personajes
- ✅ Los estados alterados funcionan
- ✅ hay pantallas entre combates y de game over/victory

Todo el sistema se encuentra en desarrollo activo.

---

## 📁 Resumen de Scripts

### `TurnManager.js`

El corazón del sistema de turnos. Controla el flujo de combate, el avance del tiempo y el estado de cada personaje.

#### Atributos principales:

- `lista`: Array de todos los personajes activos en combate.
- `intervalId`: Identificador del `setInterval()` que carga la barra ATB.
- `turno`: Booleano que indica si se están cargando las barras.

#### Getters:

- `aliados`: Retorna los personajes cuyo grupo es `"aliado"`.
- `aliadosVivos`: Retorna solo los aliados que siguen vivos.
- `enemigos`: Retorna los personajes cuyo grupo es `"enemigo"`.
- `enemigosVivos`: Retorna solo los enemigos que siguen vivos.

#### Métodos:

- `agregar(personaje)`: Agrega un personaje a `lista` si es instancia de la clase `Jugadores`.
  → Si no lo es, muestra una advertencia en consola.

---

### 🔄 Flujo de combate

1. **`cargarBarra()`**
   Si `turno === true`, comienza a llamar periódicamente a `.cargar()` en cada personaje.
   Cuando un personaje llena su barra (`carga >= 100`), se detiene la carga y se inicia su turno.

2. **`detenerCarga()`**
   Detiene el flujo de carga (ATB) desactivando `intervalId` y cambiando `turno` a `false`.
   → Esto garantiza que no se activen múltiples turnos al mismo tiempo.

3. **`reanudarCarga()`**
   Restaura el flujo de carga si `turno === false`.

4. **`terminarTurno()`**
   Finaliza el turno activo y vuelve a activar la carga de barras.

---

## ✍️ Notas

- El sistema está diseñado para expandirse fácilmente con nuevas acciones, IA, efectos de estado y hechizos.
- Las decisiones arquitectónicas están pensadas en mantener la lógica del juego separada de la UI.

---
