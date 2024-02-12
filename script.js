let player1 = true;
let player2 = false;

let turnText = document.querySelector(".turn-text");

let container = document.querySelector(".container");

container.addEventListener("click", function (e) {
  if (e.target.className === "cell" && !e.target.classList.contains("filled")) {
    if (player1) {
      player1 = false;
      player2 = true;
      turnText.innerHTML = "It is O's turn.";
      e.target.classList.add("filled", "cross");
    } else if (player2) {
      player1 = true;
      player2 = false;
      turnText.innerHTML = "It is X's turn.";
      e.target.classList.add("filled", "circle");
    }
  }

  handleGameValidation(e.target);
});

function handleGameValidation(clickedElement) {
  const data = handleCorners() || handleMiddle() || handleAsideMiddle();
  if (data?.victor === "X") {
    turnText.innerHTML = "X wins!";
    container.style.pointerEvents = "none";
  } else if (data?.victor === "O") {
    turnText.innerHTML = "O wins!";
    container.style.pointerEvents = "none";
  }

  if (data?.victor) {
    drawLine(data);
  }

  if (document.querySelectorAll(".filled").length === 9 && !data?.victor) {
    turnText.innerHTML = "Tie!";
  }
}

function handleCorners() {
  const cornerCellWon = [
    ["11", "22", "33"],
    ["11", "21", "31"],
    ["11", "12", "13"],
    ["13", "23", "33"],
    ["33", "32", "31"],
    ["13", "22", "31"],
    ["31", "22", "13"],
  ];

  return executeLogic(cornerCellWon);
}

function executeLogic(victoryCellsArray) {
  let isSameX;
  let victoryLineArray = [];
  for (let victoryCellArray of victoryCellsArray) {
    if (isSameX) return { victor: "X", lineArray: victoryLineArray };
    isSameX = null;
    loop2: for (let cell of victoryCellArray) {
      if (document.getElementById(cell).classList.contains("cross")) {
        isSameX = true;
        victoryLineArray.push(cell);
      } else {
        isSameX = false;
        victoryLineArray = [];
        break loop2;
      }
    }
  }

  let isSameO;
  victoryLineArray = [];
  for (let victoryCellArray of victoryCellsArray) {
    if (isSameO) return { victor: "O", lineArray: victoryLineArray };
    isSameO = null;
    loop2: for (let cell of victoryCellArray) {
      if (document.getElementById(cell).classList.contains("circle")) {
        isSameO = true;
        victoryLineArray.push(cell);
      } else {
        isSameO = false;
        victoryLineArray = [];
        break loop2;
      }
    }
  }

  return null;
}

function handleMiddle() {
  const middleCellWon = [
    ["22", "12", "32"],
    ["21", "22", "23"],
    ["11", "22", "33"],
    ["31", "22", "13"],
  ];

  return executeLogic(middleCellWon);
}

function handleAsideMiddle() {
  const middleAsideCellWon = [
    ["21", "11", "31"],
    ["21", "22", "23"],
    ["12", "22", "32"],
    ["11", "12", "13"],
    ["23", "13", "33"],
    ["21", "22", "23"],
  ];

  return executeLogic(middleAsideCellWon);
}

function drawLine(data) {
  const firstElement = document
    .getElementById(data.lineArray.sort()[0])
    .getBoundingClientRect();

  const lastElement = document
    .getElementById(data.lineArray.sort()[data.lineArray.length - 1])
    .getBoundingClientRect();

  const container = document
    .querySelector(".container")
    .getBoundingClientRect();

  console.log(firstElement, lastElement, container);

  const lineCanvas = document.getElementById("lineCanvas");
  lineCanvas.style.zIndex = 100;
  var ctx = lineCanvas.getContext("2d");

  ctx.moveTo(
    firstElement.x - container.x + firstElement.width / 2,
    firstElement.y - container.y + firstElement.height / 2
  );
  ctx.strokeStyle = "#702F00";
  ctx.lineWidth = "5.0";

  ctx.lineTo(
    lastElement.x - container.x + lastElement.width / 2,
    lastElement.y - container.y + lastElement.height / 2
  );
  ctx.stroke();

  playAgain(ctx);
}

function playAgain(ctx) {
  document.querySelector(".play-again").addEventListener("click", function () {
    let cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.className = "cell";
    });
    container.style.pointerEvents = "auto";
    lineCanvas.style.zIndex = -10;
    ctx.reset();
    player1 = true;
    player2 = false;
    turnText.innerHTML = "It is X's turn.";
  });
}
