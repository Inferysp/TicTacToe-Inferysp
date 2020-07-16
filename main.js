
const PLAYER1 = "fa-circle-o";
const PLAYER2 = "fa-times";
const matchResults = { score1: 0, score2: 0, draw: 0 };
const combinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
let playRound = 1;
let turnInRound = 1;
let result;
let winner = null;
const boardVanish = () => board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];


const statContainerBar = document.querySelector(".statistics-side-bar");
const newGameNav = document.querySelector(".nav-item-link-new-game");
const gameContainer = document.querySelector(".board-container");
const element = document.querySelector(".board");
const oResult = document.querySelector(".o-results");
const xResult = document.querySelector(".x-results");
const drawResult = document.querySelector(".draw-results");

const boxes = [...document.querySelectorAll(".box")];
boxes.forEach((box) => box.addEventListener("click", pick));

const statBar = document.createElement("div");
const gameDiv = document.createElement("div");
const gameButton = document.createElement("button");

statBar.className = "statistic-dynamic-side-bar";
gameDiv.className = "game-btn-div";
gameContainer.appendChild(gameDiv);


gameButton.className = "game-btn";
gameDiv.appendChild(gameButton);

newGameNav.addEventListener("click", beginNewGame);

window.addEventListener("DOMContentLoaded", startGame);

function beginNewGame() {
  const statBarDelete = document.querySelector(".statistic-dynamic-side-bar");
  const removeChildrenElement = () => {
    while (statBarDelete.firstChild) {
      statBarDelete.removeChild(statBarDelete.firstChild);
    }
  };
  statBarDelete != null ? removeChildrenElement() : null;

  gameDiv.style.visibility = "hidden"
    ? (gameDiv.style.visibility = "visible")
    : null;
  element.style.display = "none";
  oResult.innerHTML = null;
  xResult.innerHTML = null;
  drawResult.innerHTML = null;
  gameButton.innerText = `Play the Game!`;
  playRound = 1;
}

function startGame() {
  element.style.display = "none";
  gameDiv.style.visibility = "visible";
  gameButton.innerText = `Play the Game!`;
  gameButton.addEventListener("click", btnClick);
}

function btnClick() {
  statContainerBar.appendChild(statBar);
  gameDiv.style.visibility = "hidden";
  element.style.display = "grid";
  element.style.setProperty("pointer-events", "auto");

  const whichPlayerStart = document.createElement("p");
  whichPlayerStart.id = "player-begins-class";
  whichPlayerStart.innerText = whoStartRound();
  statBar.appendChild(whichPlayerStart);

  boxes.forEach((e) => (e.className = "box fa"));
  boardVanish();
}

const playNextRound = (data) => {
  data = playRound == 1 ? 1 : playRound;

  element.style.setProperty("pointer-events", "none");
  gameDiv.style.visibility = "visible";
  gameButton.innerText = `Let's play round ${data}`;
  gameButton.addEventListener("click", btnClick);
};

// const setPick = () => {
//   const statDiv = document.createElement("table");
//   statDiv.className = "stat-table-box";
//   statBar.appendChild(statDiv);
// }

const finnishPick = (e, rowData, columnData, turnData, statTable) => {
  if (board[rowData][columnData] !== "") return;
  e.target.classList.add(turnData);
  board[rowData][columnData] = turnData;
  turnInRound++;
  pickPositionWrite(rowData, columnData, turnData, statTable);
  check();
}

function pick(e) {
  const statTable = document.createElement("table");
  statTable.className = "stat-table-box";
  statBar.appendChild(statTable);
  const { row, column } = e.target.dataset;
  if (winner === null || winner === "Winner: Player 2") {
    const turn = turnInRound % 2 === 0 ? PLAYER2 : PLAYER1;
    finnishPick(e, row, column, turn, statTable);
  } else if (winner === "Winner: Player 1" || winner === "Draw") {
    const turn = turnInRound % 2 === 0 ? PLAYER1 : PLAYER2;
    finnishPick(e, row, column, turn, statTable);
  }
}

const check = () => {
  let moves = {
    "fa-times": [],
    "fa-circle-o": [],
  };
  result = board.reduce((total, row) => total.concat(row));
  result.forEach((field, index) =>
    moves[field] ? moves[field].push(index) : null
  );
  combinations.forEach((combinations) => {
    if (combinations.every((index) => moves[PLAYER1].indexOf(index) > -1)) {
      winner = "Winner: Player 1";
      matchResults.score1 += 1;
      oResult.innerHTML = matchResults.score1;
      writeWhoWin();
      roundFinishing();
    } else if (
      combinations.every((index) => moves[PLAYER2].indexOf(index) > -1)
    ) {
      winner = "Winner: Player 2";
      matchResults.score2 += 1;
      xResult.innerHTML = matchResults.score2;
      writeWhoWin();
      roundFinishing();
    }
  });
    if ( turnInRound == 10) {
      winner = "Draw";
      matchResults.draw += 1;
      drawResult.innerHTML = matchResults.draw;
      writeWhoWin();
      roundFinishing();
  };
};

const roundFinishing = () => {
  turnInRound = 1;
  playRound++;
  playNextRound(playRound);
};

const writeWhoWin = () => {
  const statisticsElement = document.createElement("p");
  statisticsElement.className ="round-winner-paragraph";
  statisticsElement.innerText = `${winner}!`;
  statBar.appendChild(statisticsElement);
};

const pickPositionWrite = (rowData, columnData, turnData, statTableData) => {
  const moveCoOrdinates = document.createElement("tr");
  moveCoOrdinates.id = `move-coordinates`;
  const player = turnData == "fa-times" ? "x" : "o";
  rowData = parseInt(rowData, 10);
  columnData = parseInt(columnData, 10);
  rowData += 1;
  columnData += 1;
  moveCoOrdinates.innerHTML = `turn ${turnInRound}. ${player} - row: ${rowData} -col: ${columnData} .`;
  statTableData.appendChild(moveCoOrdinates);
};

const whoStartRound = () => {
  if (winner == "Winner: Player 2") {
    return `PLAYER 1 begins round ${playRound}`;
  }
  else if (winner == "Winner: Player 1") {
    return `PLAYER 2 begins round ${playRound}`;
  }
  else if (winner == 'Draw' || winner == null) {
    return  `PLAYER 1 begins round ${playRound}`;
  }
};
