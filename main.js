function player(symbol, id, iconName, winner) {
  this.symbol = symbol;
  this.id = id;
  this.iconName = iconName;
  this.winner = winner;
}
const PLAYER_1 = new player('o', Math.floor(Math.random()*1000), 'fa-circle-o', "Winner: Player 1");
const PLAYER_2 = new player('x', Math.floor(Math.random()*1000), 'fa-times', "Winner: Player 2");
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
gameButton.className = "game-btn";
gameContainer.appendChild(gameDiv);
gameDiv.appendChild(gameButton);
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

// THIS FUNCTIONALITY IS NOT NECESSARY WHILE RUNNING ON GITHUB-PAGES
// window.addEventListener("DOMContentLoaded", startGame);

// newGameNav.addEventListener("click", beginNewGame);

// function beginNewGame() {
//   const statBarDelete = document.querySelector(".statistic-dynamic-side-bar");
//   const removeChildrenElement = () => {
//     while (statBarDelete.firstChild) {
//       statBarDelete.removeChild(statBarDelete.firstChild);
//     }
//   };
//   statBarDelete != null ? removeChildrenElement() : null;

//   gameDiv.style.visibility = "hidden"
//     ? (gameDiv.style.visibility = "visible")
//     : null;
//   element.style.display = "none";
//   oResult.innerHTML = null;
//   xResult.innerHTML = null;
//   drawResult.innerHTML = null;
//   gameButton.innerText = `Play the Game!`;
//   playRound = 1;
// }

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
  whichPlayerStart.className = `player-begins-class-${playRound}`;
  whichPlayerStart.style.padding = '4px';
  whichPlayerStart.display = 'flex';
  whichPlayerStart.justifyContent = 'center';
  playRound > 1 ? document.querySelector(`.player-begins-class-${playRound-1}`).style.borderTop = 'solid 2px pink' : null;
  whichPlayerStart.innerText = whoStartRound();
  statBar.prepend(whichPlayerStart);
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

const innerPickProcess = (e, rowData, columnData, turnData, statTable) => {
  if (board[rowData][columnData] !== "") return;
  e.target.classList.add(turnData);
  board[rowData][columnData] = turnData;
  writePickPosition(rowData, columnData, turnData, statTable);
  turnInRound++;
  check();
}

function pick(e) {
  const statTable = document.createElement("table");
  statTable.className = "stat-table-box";
  const whichPlayerStart = document.querySelector(`.player-begins-class-${playRound}`);
  whichPlayerStart.append(statTable);
  const { row, column } = e.target.dataset;
  if (winner === null || winner === PLAYER_2.winner) {
    const turn = turnInRound % 2 === 0 ? PLAYER_2.iconName : PLAYER_1.iconName;
    innerPickProcess(e, row, column, turn, statTable);
  } else if (winner === PLAYER_1.winner || winner === "Draw") {
    const turn = turnInRound % 2 === 0 ? PLAYER_1.iconName : PLAYER_2.iconName;
    innerPickProcess(e, row, column, turn, statTable);
  }
}

const innerCheckProcess = (tellMeWhoWin) => {
  if(tellMeWhoWin == PLAYER_1.winner) {
    matchResults.score1 += 1;
    oResult.innerHTML = matchResults.score1;
  } else if(tellMeWhoWin == PLAYER_2.winner) {
    matchResults.score2 += 1;
    xResult.innerHTML = matchResults.score2;
  }
  writeWhoWin();
  roundFinishing();
}

const check = () => {
  let moves = {
    'fa-times': [],
    'fa-circle-o': [],
  };
  result = board.reduce((total, row) => total.concat(row));
  result.forEach((field, index) =>
    moves[field] ? moves[field].push(index) : null
  );
  combinations.forEach((combinations) => {
    if (combinations.every((index) => moves[PLAYER_1.iconName].indexOf(index) > -1)) {
      winner = PLAYER_1.winner;
      innerCheckProcess(winner);
    } else if (
      combinations.every((index) => moves[PLAYER_2.iconName].indexOf(index) > -1)
    ) {
      winner = PLAYER_2.winner;
      innerCheckProcess(winner)
    }
  });
    if (turnInRound == 10) {
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
  const whichPlayerStart = document.querySelector(`.player-begins-class-${playRound}`);
  whichPlayerStart.append(statisticsElement);
};

const writePickPosition = (rowData, columnData, turnData, statTableData) => {
  const moveCoOrdinates = document.createElement("tr");
  const player = turnData == PLAYER_2.iconName ? "x" : "o";
  rowData = parseInt(rowData, 10);
  columnData = parseInt(columnData, 10);
  moveCoOrdinates.innerHTML = `turn ${turnInRound}. ${player} - row: ${rowData+1} -col: ${columnData+1} .`;
  statTableData.appendChild(moveCoOrdinates);
};

const whoStartRound = () => {
  if (winner == PLAYER_2.winner) {
    return `PLAYER 1 begins round ${playRound}`;
  } else if (winner == PLAYER_1.winner) {
    return `PLAYER 2 begins round ${playRound}`;
  } else if (winner == 'Draw' || winner == null) {
    return  `PLAYER 1 begins round ${playRound}`;
  }
};