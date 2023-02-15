const canvas = document.querySelector("#game");
// //Para acceder a los metodos y dibujar sobre el canvas guardo en la variable game el contexto 2D del juego
const game = canvas.getContext("2d");

let canvasSize;
let elementsSize;

//Escuchar eventos del navegador. Ejecuto la funcion cada vez que cargue el HTML o se haga resize en el navegador
window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

//Funcion para renderizar el mapa y el jugador
function startGame() {
  console.log({ canvasSize, elementsSize });

  //Inserto un emoji[x] en la posicion 100, 100
  game.font = elementsSize + "px Verdana";
  game.textAlign = "end";
  console.log(game);
  console.log(elementsSize);

  for (let i = 1; i <= 10; i++) {
    //En cada iteracion renderizamos filtext
    game.fillText(emojis["X"], elementsSize * i, elementsSize);
  }
  /*canvas.setAttribute("width", window.innerWidth * 0.75);
  canvas.setAttribute("height", window.innerHeight * 0.5);
  window.innerHeight;
  window.innerWidth;
  game.fillRect(0, 50, 100, 100);
  game.clearRect(50, 50, 50, 50);
  game.clearRect(0,0,50,50)

  game.font = "14px Verdana";
  game.fillStyle = "purple";
  game.textAlign = "start";
  game.fillText("VideoGame", 10, 30);*/
}

//Esta funcion se encarga de hacer el resize(ajustar el canvas para tamaño desktop y mobile)
function setCanvasSize() {
  //Pregunto si la altura es mayor que el ancho(width). Aqui se define el canvasSize
  if (window.innerHeight > window.innerWidth) {
    //canvaSize sera igual al widt. Agarro el 80% de su ancho(window)
    canvasSize = window.innerWidth * 0.6;
  } else {
    //Si el ancho es mayor que la altura agarro el 80% de height(window)
    canvasSize = window.innerHeight * 0.6;
  }

  //Le asigno su atributo width a canvas diciendole que sea lo equivalente al canvasSize
  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);

  //Como tenemos una grilla 10x10 dividimos el tamaño del canvasSize en 10
  elementsSize = canvasSize / 10;

  //Una vez se defina el canvas llamo la funcion
  startGame();
}

//Cada vez que quiera moverme en el canvas de izquierda a derecha sera el eje x, para movernos de arriba hacia abajo sera en el eje y
