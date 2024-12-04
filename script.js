const Gameboard = (() => {
  const rows = 3;
  const columns = 3;
  const board = []; // this will store the rows/columns

  // Each row will be an array and contain a cell obj
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const placeMark = (row, col, playerMark) => {
    // check if the cell is empty, only then will it add the mark
    if (board[row][col].getValue() === "E") {
      board[row][col].addMarkToCell(playerMark);
    }
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  return { getBoard, placeMark, printBoard };
})();

/*
  This represents each cell in the board
  E: Empty mark in the cell
  X: Player 1's mark
  O: Player 2's mark 
*/
function Cell() {
  let value = "E";

  const addMarkToCell = (playerMark) => (value = playerMark);

  const getValue = () => value;

  return { addMarkToCell, getValue };
}

function GameController(playerOne = "Player 1", playerTwo = "Player 2") {
  const board = Gameboard.getBoard();

  const getBoard = () => board;
  const players = [
    { name: playerOne, mark: "X" },
    { name: playerTwo, mark: "O" },
  ];

  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;

  const switchPlayerTurn = () =>
    (activePlayer = activePlayer === players[0] ? players[1] : players[0]);

  const printNewRound = () => {
    Gameboard.printBoard();
    console.log(`${getActivePlayer().name}'s turn`);
  };

  const playRound = (row, column) => {
    console.log(`${getActivePlayer().name} is placing their mark`);
    Gameboard.placeMark(row, column, getActivePlayer().mark);

    determineWinner();

    switchPlayerTurn();
    printNewRound();
  };

  printNewRound(); // Initial game message

  const determineWinner = () => {
    const playerMark = getActivePlayer().mark;
    // Check 3 consecutive marks horizontally, vertically, and diagonally

    // iterate each row then, check through each col for 3 consecutive marks
    const checkHorizontally = () => {
      for (let row = 0; row < board.length; row++) {
        const col = 0;
        if (
          board[row][col].getValue() === playerMark &&
          board[row][col + 1].getValue() === playerMark &&
          board[row][col + 2].getValue() === playerMark
        ) {
          return true;
        }
      }
      return false;
    };

    // iterate each column, then check each row for 3 consecutive marks
    const checkVertically = () => {
      const rowLength = board[0].length;
      for (let col = 0; col < rowLength; col++) {
        const row = 0;
        if (
          board[row][col].getValue() === playerMark &&
          board[row + 1][col].getValue() === playerMark &&
          board[row + 2][col].getValue() === playerMark
        ) {
          return true;
        }
      }
      return false;
    };

    // checks for diagonal marks (top-left to bottom-right and top-right to bottom-left)
    const checkDiagonally = () => {
      function checkTopLeftToBottomRight() {
        const row = 0;
        const col = 0;
        return (
          board[row][col].getValue() === playerMark &&
          board[row + 1][col + 1].getValue() === playerMark &&
          board[row + 2][col + 2].getValue() === playerMark
        );
      }

      function checkTopRightToBottomLeft() {
        const row = 0;
        const col = 2; // start at the last column
        return (
          board[row][col].getValue() === playerMark &&
          board[row + 1][col - 1].getValue() === playerMark &&
          board[row + 2][col - 2].getValue() === playerMark
        );
      }

      return checkTopLeftToBottomRight() || checkTopRightToBottomLeft();
    };

    const checkTie = () => {
      // check if all cells are occupied
      const boardWithCellValues = () =>
        board.map((row) => row.filter((cell) => cell.getValue() !== "E"));

      return boardWithCellValues.length === 0;
    };

    if (checkHorizontally() || checkVertically() || checkDiagonally()) {
      console.log(`${getActivePlayer().name} wins!`);
    }

    // TODO: FIXDraw keeps printing when playing using the UI
    if (checkTie()) {
      // console.log("Draw!");
    }
  };

  return { getActivePlayer, playRound, getBoard };
}

function ScreenController(gameController) {
  const controller = gameController;
  const playerTurnDiv = document.querySelector(".turn");
  const winnerDiv = document.querySelector(".winner");
  const boardDiv = document.querySelector(".board");

  const updateScreen = () => {
    // clear board
    boardDiv.innerHTML = "";

    // get the newest version of the board and player turn
    const board = controller.getBoard();
    const activePlayer = controller.getActivePlayer();

    playerTurnDiv.textContent = activePlayer.name;
    board.forEach((row, rowIndex) => {
      const rowDiv = document.createElement("div");
      rowDiv.className = "row";

      row.forEach((cell, cellIndex) => {
        const cellBtn = document.createElement("button");
        cellBtn.className = "cell";

        cellBtn.textContent = cell.getValue();
        cellBtn.dataset.row = rowIndex;
        cellBtn.dataset.col = cellIndex;

        rowDiv.appendChild(cellBtn);
      });
      boardDiv.appendChild(rowDiv);
    });
  };

  boardDiv.addEventListener("click", (e) => {
    const cell = e.target;
    const selectedCellCol = Number(cell.dataset.col);
    const selectedCellRow = Number(cell.dataset.row);

    if (cell.classList.contains("cell")) {
      controller.playRound(selectedCellRow, selectedCellCol);
      updateScreen();
    }
  });

  updateScreen();
}
// controller.playRound(0, 2);
// controller.playRound(0, 0);
// controller.playRound(1, 1);
// controller.playRound(0, 1);
// controller.playRound(1, 0);
// controller.playRound(1, 2);
// controller.playRound(2, 1);
// controller.playRound(2, 0);
// controller.playRound(2, 2);
const controller = new GameController("Human", "Robot");
ScreenController(controller);
