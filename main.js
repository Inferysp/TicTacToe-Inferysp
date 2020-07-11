const PLAYER1 = "fa-circle-o";
const PLAYER2 = "fa-times";
let playRound = 1;
let turnInRound = 1;
let result;
let isGameOver = false;
let winner = "";

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
const statBar = document.querySelector(".statistics-side-bar");
const boxes = [...document.querySelectorAll(".box")];
boxes.forEach((box) => box.addEventListener("click", pick));

const gameDiv = document.createElement("div");
gameDiv.className = "game-btn-div";

const gameContainer = document.querySelector(".board-container");
gameContainer.appendChild(gameDiv);

const gameButton = document.createElement("button");
gameButton.className = "game-btn";
gameDiv.appendChild(gameButton);

window.addEventListener("DOMContentLoaded", playTheGame);

function playTheGame(data) {
  data = playRound == 1 ? 1 : playRound;

  const gameButton = document.querySelector(".game-btn");
  const gameDiv = document.querySelector(".game-btn-div");
  const element = document.querySelector(".board");
  element.style.display = "none";
  gameDiv.style.display = "initial";
  gameButton.innerText = `Let's play round ${data}`;
  gameButton.addEventListener("click", btnClick);
}

function btnClick() {
  const gameBtnDiv = document.querySelector(".game-btn-div");
  const element = document.querySelector(".board");
  gameBtnDiv.style.display = "none";
  element.style.display = "grid";

  const whichPlayerStart = document.createElement("p");
  whichPlayerStart.id = "player-begins-class";
  whichPlayerStart.innerText = whoStartRound(winner);
  statBar.appendChild(whichPlayerStart);
}

function pick(e) {
  const statTable = document.createElement("table");
  statTable.className = "stat-table-box";
  statBar.appendChild(statTable);
  const { row, column } = e.target.dataset;
  console.log(winner);
  if (winner === "" || winner === "Winner: Player 1") {
    console.log(winner);
    const turn = turnInRound % 2 === 0 ? PLAYER1 : PLAYER2;
    if (board[row][column] !== "") return;
    showMoves(turn, statTable);
    e.target.classList.add(turn);
    board[row][column] = turn;
    turnInRound++;
    check(playRound);
  } else if (winner === "Winner: Player 2") {
    const turn = turnInRound % 2 === 0 ? PLAYER2 : PLAYER1;
    if (board[row][column] !== "") return;
    showMoves(turn, statTable);
    e.target.classList.add(turn);
    board[row][column] = turn;
    turnInRound++;
    check(playRound);
  }
  if (isGameOver) {
    board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    isGameOver = false;
  }
}

function check(whichRound) {
  let roundCheck = whichRound;
  result = board.reduce((total, row) => total.concat(row));
  let moves = {
    "fa-times": [],
    "fa-circle-o": [],
  };
  result.forEach((field, index) =>
    moves[field] ? moves[field].push(index) : null
  );
  combinations.forEach((combinations) => {
    if (combinations.every((index) => moves[PLAYER1].indexOf(index) > -1)) {
      winner = "Winner: Player 1";
      result.forEach((e, index) => (e[index] = ""));
      statistics(roundCheck, winner, statBar);
      roundIsOver(result);
    }
    if (combinations.every((index) => moves[PLAYER2].indexOf(index) > -1)) {
      winner = "Winner: Player 2";
      statistics(roundCheck, winner, statBar);
      roundIsOver(result);
    }
    if (result.every((e) => e !== "")) {
      winner = "Remis";
      statistics(roundCheck, winner, statBar);
      roundIsOver(result);
    }
  });
  return winner;
}

function roundIsOver(resultData) {
  boxes.forEach((e) => (e.className = "box fa"));
  result = resultData.map((e) => (e = ""));
  moves = {
    "fa-times": [],
    "fa-circle-o": [],
  };
  playRound++;
  turnInRound = 1;
  isGameOver = true;
  playTheGame(playRound);
}

function statistics(statVar, winVar, statBarData) {
  const statisticsElement = document.createElement("p");
  statisticsElement.id = "round";
  statisticsElement.innerText = `Round ${statVar}. ${winVar}!`;

  statBarData.appendChild(statisticsElement);
}

function showMoves(turnData, statTableData) {
  const moveCoOrdinates = document.createElement("tr");
  moveCoOrdinates.id = `move-coordinates`;
  moveCoOrdinates.innerHTML = `${turnInRound}. ${turnData}: coords `;

  statTableData.appendChild(moveCoOrdinates);
}

function whoStartRound(data) {
  if (data == "Winner: Player 1") {
    return `PLAYER 2 begins round ${playRound}`;
  } else {
    return `PLAYER 1 begins round ${playRound}`;
  }
}
