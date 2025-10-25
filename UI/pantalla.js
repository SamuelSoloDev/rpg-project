async function Screen() {
  let body = document.getElementById("base");
  body.textContent = "";

  const startScreen = document.createElement("div");
  startScreen.classList.add("startScreen", "screen");

  const mainLogo = document.createElement("div");
  mainLogo.id = "mainLogo";

  const startContainer = document.createElement("div");
  startContainer.id = "startContainer";

  const startBtn = document.createElement("button");
  startBtn.id = "startBtn";
  startBtn.textContent = "Start";

  startContainer.appendChild(startBtn);
  startScreen.appendChild(mainLogo);
  startScreen.appendChild(startContainer);
  document.body.appendChild(startScreen);

  // 👇 Esto sí detiene el flujo hasta que se hace clic
  await new Promise(resolve => {
    startBtn.addEventListener("click", () => {
      startScreen.remove();
      resolve(); // ✅ continúa el flujo
    });
  });
}

async function midGameScreen(estancia) {

  let body = document.getElementById("base");
  body.textContent = "";

  const midGameScreen = document.createElement("div");
  midGameScreen.classList.add("midGameScreen", "screen")

  const estanciaActual = document.createElement("h1");
  estanciaActual.classList.add("estancia")
  estanciaActual.textContent = `Siguiente estancia: ${estancia}`

  midGameScreen.appendChild(estanciaActual);
  body.appendChild(midGameScreen);

  await new Promise(resolve => setTimeout(resolve, 4000));
body.textContent = "";

}

async function EndScreen(ganador) {
  let body = document.getElementById("base");
  body.textContent = "";

  const endScreen = document.createElement("div");
  endScreen.classList.add("endScreen", "screen");

  const endMessage = document.createElement("h1");
  endMessage.classList.add("endMessage");
  endMessage.textContent = ganador === "aliados"
    ? "🛡️ ¡Los héroes han triunfado!"
    : "🏴‍☠️ Los enemigos dominan la batalla...";

  const continueContainer = document.createElement("div");
  continueContainer.id = "continueContainer";

  const continueBtn = document.createElement("button");
  continueBtn.id = "continueBtn";
  continueBtn.textContent = "Continuar";

  continueContainer.appendChild(continueBtn);
  endScreen.appendChild(endMessage);
  endScreen.appendChild(continueContainer);
  body.appendChild(endScreen);

  // Espera a que el jugador presione el botón para continuar
  await new Promise(resolve => {
    continueBtn.addEventListener("click", () => {
      endScreen.remove();
      resolve();
    });
  });
}


export {Screen, midGameScreen, EndScreen};