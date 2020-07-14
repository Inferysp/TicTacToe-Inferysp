const PLAYER1 = "fa-circle-o";
const PLAYER2 = "fa-times";
let playRound = 1;
let turnInRound = 1;
let result;
let winner = "";
let rambo = false;
const matchResults = { score1: 0, score2: 0, draw: 0 };

let board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

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

const boxes = [...document.querySelectorAll(".box")];
boxes.forEach((box) => box.addEventListener("click", pick));

const newGameNav = document.querySelector(".nav-item-link-new-game");
newGameNav.addEventListener("click", newGame);

const oResult = document.querySelector(".o-results");
const xResult = document.querySelector(".x-results");
const drawResult = document.querySelector(".draw-results");

const statContainerBar = document.querySelector(".statistics-side-bar");
const statBar = document.createElement("div");
statBar.className = "statisctic-dynamic-side-bar";

const gameDiv = document.createElement("div");
gameDiv.className = "game-btn-div";

const gameContainer = document.querySelector(".board-container");
gameContainer.appendChild(gameDiv);

const gameButton = document.createElement("button");
gameButton.className = "game-btn";
gameDiv.appendChild(gameButton);

const element = document.querySelector(".board");

window.addEventListener("DOMContentLoaded", startTheGame);

function newGame() {
  const statBarDelete = document.querySelector(".statisctic-dynamic-side-bar");
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
function startTheGame() {
  const gameButton = document.querySelector(".game-btn");
  const gameDiv = document.querySelector(".game-btn-div");

  element.style.display = "none";
  gameDiv.style.visibility = "visible";
  gameButton.innerText = `Play the Game!`;
  gameButton.addEventListener("click", btnClick);
}

function btnClick() {
  statContainerBar.appendChild(statBar);
  const gameDiv = document.querySelector(".game-btn-div");
  gameDiv.style.visibility = "hidden";
  element.style.display = "grid";
  element.style.setProperty("pointer-events", "auto");

  const whichPlayerStart = document.createElement("p");
  whichPlayerStart.id = "player-begins-class";
  whichPlayerStart.innerText = whoStartRound(winner);
  statBar.appendChild(whichPlayerStart);

  boxes.forEach((e) => (e.className = "box fa"));
  board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
}

const playTheGame = (data) => {
  data = playRound == 1 ? 1 : playRound;
  const gameButton = document.querySelector(".game-btn");
  const gameDiv = document.querySelector(".game-btn-div");
  const element = document.querySelector(".board");
  element.style.setProperty("pointer-events", "none");
  gameDiv.style.visibility = "visible";
  gameButton.innerText = `Let's play round ${data}`;
  gameButton.addEventListener("click", btnClick);
};

function pick(e) {
  const statTable = document.createElement("table");
  statTable.className = "stat-table-box";
  statBar.appendChild(statTable);
  const { row, column } = e.target.dataset;
  console.log(winner);
  if (winner === "" || winner === "Winner: Player 2") {
    const turn = turnInRound % 2 === 0 ? PLAYER2 : PLAYER1;
    if (board[row][column] !== "") return;
    showMoves(row, column, turn, statTable);
    e.target.classList.add(turn);
    board[row][column] = turn;
    turnInRound++;
    check();
  } else if (winner === "Winner: Player 1" || winner === "Draw") {
    const turn = turnInRound % 2 === 0 ? PLAYER1 : PLAYER2;
    if (board[row][column] !== "") return;
    showMoves(row, column, turn, statTable);
    e.target.classList.add(turn);
    board[row][column] = turn;
    turnInRound++;
    check();
  }
}

const check = () => {
  let moves = {
    "fa-times": [],
    "fa-circle-o": [],
  };
  console.log(rambo);
  result = board.reduce((total, row) => total.concat(row));
  result.forEach((field, index) =>
    moves[field] ? moves[field].push(index) : null
  );
  combinations.forEach((combinations) => {
    if (combinations.every((index) => moves[PLAYER1].indexOf(index) > -1)) {
      rambo = true;
      winner = "Winner: Player 1";
      matchResults.score1 += 1;
      oResult.innerHTML = matchResults.score1;
      statistics(winner);
      roundIsOver();
    } else if (
      combinations.every((index) => moves[PLAYER2].indexOf(index) > -1)
    ) {
      rambo = true;
      winner = "Winner: Player 2";
      matchResults.score2 += 1;
      xResult.innerHTML = matchResults.score2;
      statistics(winner);
      roundIsOver();
    } else if (rambo == false && turnInRound >= 10) {
      winner = "Draw";
      matchResults.draw += 1;
      drawResult.innerHTML = matchResults.draw;
      statistics(winner);
      roundIsOver();
      rambo = false;
    }
  });
  return winner, matchResults;
};

const roundIsOver = () => {
  turnInRound = 1;
  playRound++;
  rambo = false;
  playTheGame(playRound);
};

const statistics = (winVar) => {
  const statisticsElement = document.createElement("p");
  statisticsElement.id = "round-winner-paragraph";
  statisticsElement.innerText = `${winVar}!`;
  statBar.appendChild(statisticsElement);
};

const showMoves = (rowData, columnData, turnData, statTableData) => {
  const moveCoOrdinates = document.createElement("tr");
  moveCoOrdinates.id = `move-coordinates`;
  const player = turnData == "fa-times" ? "x" : "o";
  rowData = parseInt(rowData);
  columnData = parseInt(columnData);
  rowData += 1;
  columnData += 1;
  moveCoOrdinates.innerHTML = `turn ${turnInRound}. ${player} - row: ${rowData} -col: ${columnData} .`;
  statTableData.appendChild(moveCoOrdinates);
};

const whoStartRound = (data) => {
  if (data == "Winner: Player 2") {
    return `PLAYER 1 begins round ${playRound}`;
  } else {
    return `PLAYER 2 begins round ${playRound}`;
  }
};
