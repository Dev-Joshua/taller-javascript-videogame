const canvas = document.querySelector("#game");
// //Para acceder a los metodos y dibujar sobre el canvas guardo en la variable game el contexto 2D del juego
const game = canvas.getContext("2d");
const btnUp = document.querySelector("#up");
const btnLeft = document.querySelector("#left");
const btnRight = document.querySelector("#right");
const btnDown = document.querySelector("#down");
const spanLives = document.querySelector("#lives");
const spanTime = document.querySelector("#time");
const spanRecord = document.querySelector("#record");
const pResult = document.querySelector("#result");

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

//Variable sera iguala un objeto con 2posiciones
const playerPosition = {
  x: undefined,
  y: undefined,
};

//variable para colisiones fijas(emoji regalo)
const giftPosition = {
  x: undefined,
  y: undefined,
};

//variable para colisiones con arrays(emoji bomba)
let obstacleBombs = [];

//Escuchar eventos del navegador. Ejecuto la funcion cada vez que cargue el HTML o se haga resize en el navegador
window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

function fixNumber(n) {
  return Number(n.toFixed(2));
}

//Funcion q se encarga de hacer el resize(ajustar el canvas para tamaño desktop y mobile)
function setCanvasSize() {
  //Pregunto si la altura es mayor que el ancho(width). Aqui se define el canvasSize
  if (window.innerHeight > window.innerWidth) {
    //canvaSize sera igual al widt. Agarro el 80% de su ancho(window)
    canvasSize = window.innerWidth * 0.7;
  } else {
    //Si el ancho es mayor que la altura agarro el 80% de height(window)
    canvasSize = window.innerHeight * 0.7;
  }

  canvasSize = Number(canvasSize.toFixed(0));

  //Le asigno su atributo width a canvas diciendole que sea lo equivalente al canvasSize
  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);

  //Como tenemos una grilla 10x10 dividimos el tamaño del canvasSize en 10
  elementsSize = canvasSize / 10;

  playerPosition.x = undefined;
  playerPosition.y = undefined;

  //Una vez se defina el canvas llamo la funcion
  startGame();
}

//Funcion para renderizar el mapa  y el jugador con fillText x toda la grilla cada vez que se mueva el jugador(se renderiazara el mapa)
function startGame() {
  console.log({ canvasSize, elementsSize });

  //Inserto un emoji[x]
  game.font = elementsSize + "px Verdana";
  game.textAlign = "end";

  const map = maps[level];
  //Si no hay ningun mapa dentro del array maps se termina la ejecucion aqui
  //si ya no hay mas niveles para no volver hacer render del mapa hago return en esta funcion
  if (!map) {
    gameWin();
    return;
  }

  //Si timestart no tiene algun valor entonces se lo voy a asignar
  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 100);
    showRecord();
  }

  //Creo un array de filas(donde el inicio y el final de c/elemento es cuando haya un salto de linea), selecciono el mapa le quito los espacios en blanco .trim(limpiar string)
  const mapRows = map.trim().split("\n");
  //Creo un array a partir de otro array(bidimensional). Cada fila va a ser otro array donde c/elemento son las distintas columnas
  const mapRowCols = mapRows.map((row) => row.trim().split(""));
  console.log({ map, mapRows, mapRowCols });

  showLives();

  //Borrar las repeticionesen todas las posiciones de todo lo que tenga en canvas y limpiar el array
  obstacleBombs = [];
  game.clearRect(0, 0, canvasSize, canvasSize);

  //minimizo el codigo de for a un forEach. -> Este metodo permite saber cual es el elemento que estoy recorriendo y saber su indice
  //recibe dos parametros(fila[array de columnas], indice de cada fila) y asi mismo con (col,colI)
  mapRowCols.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      //Obtengo el emoji(por la letra) por su propiedad del objeto emojis
      const emoji = emojis[col];
      //Calculo la coordenada en x,y => LA posicion en x sera(multiplicar el tamaño que debe tener nuestros elementos * indice(rowi) + 1.)
      const posX = elementsSize * (rowI + 1);
      const posY = elementsSize * (colI + 1);

      //Si la columna es igual a una O entonces:
      if (col == "O") {
        //playerPosition obtiene las coordenadas cuando la col sea 'O'(emoji puerta)
        //Si ninguno de estos elementos tiene algun numero por dentro(si es undefined):
        if (!playerPosition.x && !playerPosition.y) {
          playerPosition.x = posX;
          playerPosition.y = posY;
          console.log({ playerPosition });
        }
        //Si la columna es igual a una I esta en el regalo y pasa de nivel
      } else if (col == "I") {
        giftPosition.x = posX;
        giftPosition.y = posY;
      } else if (col == "X") {
        obstacleBombs.push({
          x: posX,
          y: posY,
        });
      }

      //Le asigno a la funcion para renderizar cualquier mapa segun las posiciones, segun el array maps.
      game.fillText(emoji, posX, posY);
      // console.log(emojis[col]);
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

  movePlayer();
}

function movePlayer() {
  //Reduzco los decimales a 2 para que coincida correctamente x y y para la colision
  playerPosition.x = fixNumber(playerPosition.x);
  playerPosition.y = fixNumber(playerPosition.y);

  const giftCollisionX = playerPosition.x == giftPosition.x;
  const giftColisionY = playerPosition.y == giftPosition.y;
  //Si coincide la coordenada entre playerposition.x y giftposition.x(asi mismo y) entonces hay colision
  const giftColision = giftCollisionX && giftColisionY;

  //Hubo colision con el emoji regalo?
  if (giftColision) {
    levelWin();
  }

  //Validacion para que avisar que el jugador hizo colision con la bomba
  const obstacleCollision = obstacleBombs.find((obstacle) => {
    const obstacleCollisionX = obstacle.x == playerPosition.x;
    const obstacleCollisionY = obstacle.y == playerPosition.y;
    // Devuelve true si ambos son true etnonces hay colision
    return obstacleCollisionX && obstacleCollisionY;
  });

  if (obstacleCollision) {
    levelFail();
  }
  //Se hace el fillText del game en la posicion que diga la variable playerPosition
  game.fillText(emojis["PLAYER"], playerPosition.x, playerPosition.y);
}

//Mediante esta funcion sube de nivel por lo tanto cambia de mapa en maps.js
function levelWin() {
  console.log("Subiste de nivel");
  level++;
  startGame();
}

//Cuando haya colision con una bomba el jugador habra perdido una vida
//Entonces se deja la posicion de player en undefined y se vuelve a ejecutar startGame() para reiniciar el juego
function levelFail() {
  console.log("Chocaste contra una bomba!");
  lives--;

  console.log(lives);
  //Si perdemos las vidas, iniciamos el nivel en 0, reiniciamos las vidas a 3 y le asignamos undefined a timeStart
  if (lives <= 0) {
    level = 0;
    lives = 3;
    timeStart = undefined;
  }

  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function gameWin() {
  console.log("Terminaste el juego!");
  //mato el intervalo de timeInterval cada vez que se llegue al final del juego
  clearInterval(timeInterval);

  const recordTime = localStorage.getItem("record_time");
  const playerTime = Date.now() - timeStart;
  //Se evalua primero si el recordTime existe, y si ese record fue superado
  if (recordTime) {
    if (recordTime >= playerTime) {
      localStorage.setItem("record_time", playerTime);
      pResult.innerHTML = "Superaste el record impuesto";
    } else {
      pResult.innerHTML = "No pudiste superar el recordn, intentalo de nuevo";
    }
    //Si es la primera vez del jugador(gano y no hay ningun record guardado en localStorage)
  } else {
    //Se guardara el record
    localStorage.setItem("record_time", playerTime);
    pResult.innerHTML = "Es tu primer record";
  }
  console.log({ recordTime, playerTime });
}

//funcion para mostrar cuantas vidas le quedan al jugador. Creo un array con las vidas para usar el metodo .fill para insertar un corazon por cada posicion del array[3]
function showLives() {
  const heartsArray = Array(lives).fill(emojis["HEART"]); // [1,2,3,]
  console.log(heartsArray);

  //Por fuera del forEach llamo a spanLives para limpiarlo(sea un nuevo string vacio)
  spanLives.innerHTML = "";
  //Recorro el array lives y xC/uno llamo a spanLives y usando el metodo .appen insertarle el corazon
  heartsArray.forEach((heart) => spanLives.append(heart));
}

//Mostrar al jugador mediante el html el tiempo jugado por partida
function showTime() {
  spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord() {
  spanRecord.innerHTML = localStorage.getItem("record_time");
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
  //Si playerPosition.y es menor que elementSize(el tope al que podemos llegar)
  //Si mi elementSize llega a ser mayor a lo que estemos asignando para el movimiento de player deberia dar OUT
  if (playerPosition.y - elementsSize < elementsSize) {
    console.log("OUT");
  } else {
    playerPosition.y -= elementsSize;
    startGame();
  }
}
function moveLeft() {
  console.log("Mover hacia la izquierda");

  if (playerPosition.x - elementsSize < elementsSize) {
    console.log("OUT");
  } else {
    //Le resto el elementsize al playerPosition para mover el emoji jugador a la izquierda
    playerPosition.x -= elementsSize;
    startGame();
  }
}
function moveRight() {
  console.log("Mover hacia la derecha");

  if (playerPosition.x + elementsSize > canvasSize) {
    console.log("OUT");
  } else {
    playerPosition.x += elementsSize;
    startGame();
  }
}
function moveDown() {
  console.log("Mover hacia abajo");

  if (playerPosition.y + elementsSize > canvasSize) {
    console.log("OUT");
  } else {
    playerPosition.y += elementsSize;
    startGame();
  }
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
