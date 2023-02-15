// console.log(maps);
const canvas = document.querySelector("#game");
//Para acceder a los metodos y dibujar sobre el canvas guardo en la variable game el contexto 2D del juego
const game = canvas.getContext("2d");

window.addEventListener("load", startGame);

function startGame() {
  game.fillRect(0, 50, 100, 100);
  // game.clearRect(50, 50, 50, 50);

  game.font = "14px Verdana";
  game.fillStyle = "purple";
  game.textAlign = "start";
  game.fillText("VideoGame", 10, 30);
}

//Cada vez que quiera moverme en el canvas de izquierda a derecha sera el eje x, para movernos de arriba hacia abajo sera en el eje y
