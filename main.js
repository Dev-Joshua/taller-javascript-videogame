const canvas = document.querySelector("#game");
// //Para acceder a los metodos y dibujar sobre el canvas guardo en la variable game el contexto 2D del juego
const game = canvas.getContext("2d");
const btnUp = document.querySelector("#up");
const btnLeft = document.querySelector("#left");
const btnRight = document.querySelector("#right");
const btnDown = document.querySelector("#down");

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

  const map = maps[0];
  //Creo un array de filas(donde el inicio y el final de c/elemento es cuando haya un salto de linea), selecciono el mapa le quito los espacios en blanco .trim(limpiar string)
  const mapRows = map.trim().split("\n");
  //Creo un array a partir de otro array(bidimensional). Cada fila va a ser otro array donde c/elemento son las distintas columnas
  const mapRowCols = mapRows.map((row) => row.trim().split(""));
  console.log({ map, mapRows, mapRowCols });

  //minimizo el codigo de for a un forEach. -> Este metodo permite saber cual es el elemento que estoy recorriendo y saber su indice
  //recibe dos parametros(fila[array de columnas], indice de cada fila) y asi mismo con (col,colI)
  mapRowCols.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      //Obtengo el emoji(por la letra) por su propiedad del objeto emojis
      const emoji = emojis[col];
      //Calculo la coordenada en x,y => LA posicion en x sera(multiplicar el tamaño que debe tener nuestros elementos * indice(rowi) + 1.)
      const posX = elementsSize * (rowI + 1);
      const posY = elementsSize * (colI + 1);
      //Le asigno a la funcion para renderizar cualquier mapa segun las posiciones, segun el array maps.
      game.fillText(emoji, posX, posY);
      // console.log(emojis[col]);
      // console.log({ row, col });
      // console.log({ row, rowI, col, colI });
    });
  });

  // //Con un ciclo anidado agregamos los emoji a cada elementSize(filas[i] y columnas[j]) de la grilla. => Map[row["col"]]
  // for (let i = 1; i <= 10; i++) {
  //   // console.log(i);
  //   for (let j = 1; j <= 10; j++) {
  //     //En cada iteracion renderizamos los elementos llenando el mapa

  //     // game.fillText(mapRowCols[i][j], elementsSize * i, elementsSize * j);
  //     //Le enviamos el mapRowCols al objeto de emojis para que tome el elemento que concuerde con estas ubicaciones(i,j-> row,col)
  //     game.fillText(
  //       emojis[mapRowCols[i - 1][j - 1]],
  //       elementsSize * i,
  //       elementsSize * j
  //     );
  //     // console.log(j);
  //   }
  // }
  /*
  game.font = "14px Verdana";
  game.fillStyle = "purple";
  game.textAlign = "start";
  game.fillText("VideoGame", 10, 30);*/
}

window.addEventListener("keydown", moveByKeys);
btnUp.addEventListener("click", moveUp);
btnLeft.addEventListener("click", moveLeft);
btnRight.addEventListener("click", moveRight);
btnDown.addEventListener("click", moveDown);

function moveByKeys(event) {
  console.log(event);
  switch (event.key) {
    case "ArrowUp":
      moveUp();
      break;
    case "ArrowLeft":
      moveLeft();
      break;
    case "ArrowRight":
      moveRight();
      break;
    case "ArrowDown":
      moveDown();
      break;
  }
  // if (event.key == "ArrowUp") {
  //   moveUp();
  // } else if (event.key == "ArrowLeft") {
  //   moveLeft();
  // } else if (event.key == "ArrowRight") {
  //   moveRight();
  // } else if (event.key == "ArrowDown") {
  //   moveDown();
  // }
}
function moveUp() {
  console.log("Mover hacia arriba");
}
function moveLeft() {
  console.log("Mover hacia la izquierda");
}
function moveRight() {
  console.log("Mover hacia la derecha");
}
function moveDown() {
  console.log("Mover hacia abajo");
}

/*
  -> Cada vez que quiera moverme en el canvas de izquierda a derecha sera el eje x, para movernos de arriba hacia abajo sera en el eje y
  -> Para poder llenar el mapa de canvas con cada uno de los emojis en una grilla de 10x10 se crea un arry bidimensional a partir de un array. 
     Asi obtenemos las filas y columnas, como resultado tendremos un array donde el mapa es un array de filas y cada fila es un array de columnas.
  -> En el ciclo for anidado creo la logica para a partir de los indices(que nos da cada uno de los ciclos for) acceder a la fila y columna correspondiente
     al elemento que estamos renderizando en el canvas.

  -> Utilizo el metodo forEach para recorrer el array
  -> Utilizo el metodo map para crear otro array a partir de recorrer un array
*/
