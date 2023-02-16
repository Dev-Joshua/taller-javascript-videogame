const canvas = document.querySelector("#game");
// //Para acceder a los metodos y dibujar sobre el canvas guardo en la variable game el contexto 2D del juego
const game = canvas.getContext("2d");

let canvasSize;
let elementsSize;

//Escuchar eventos del navegador. Ejecuto la funcion cada vez que cargue el HTML o se haga resize en el navegador
window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

//Funcion q se encarga de hacer el resize(ajustar el canvas para tamaño desktop y mobile)
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

//Funcion para renderizar el mapa  y el jugador con fillText x toda la grilla
function startGame() {
  console.log({ canvasSize, elementsSize });

  //Inserto un emoji[x]
  game.font = elementsSize + "px Verdana";
  game.textAlign = "end";

  const map = maps[2];
  //Creo un array(donde el inicio y el final de c/elemento es cuando haya un salto de linea ), selecciono el mapa[0] le quito los espacios en blanco .trim() y
  const mapRows = map.trim().split("\n");
  const mapRowCols = mapRows.map((row) => row.trim().split(""));
  console.log({ map, mapRows, mapRowCols });

  //Con un ciclo anidado agregamos los emoji a cada elementSize(filas[i] y columnas[j]) de la grilla. => Map[row["col"]]
  for (let i = 1; i <= 10; i++) {
    // console.log(i);
    for (let j = 1; j <= 10; j++) {
      //En cada iteracion renderizamos filtext
      // game.fillText(emojis["X"], elementsSize * i, elementsSize * j);
      // console.log(j);
      // game.fillText(mapRowCols[i][j], elementsSize * i, elementsSize * j);
      //Le enviamos el mapRowCols al objeto de emojis para que tome el elemento que concuerde con estas ubicaciones(i,j-> row,col)
      game.fillText(
        emojis[mapRowCols[i - 1][j - 1]],
        elementsSize * i,
        elementsSize * j
      );
    }
  }
  /*
  game.font = "14px Verdana";
  game.fillStyle = "purple";
  game.textAlign = "start";
  game.fillText("VideoGame", 10, 30);*/
}

//Cada vez que quiera moverme en el canvas de izquierda a derecha sera el eje x, para movernos de arriba hacia abajo sera en el eje y
