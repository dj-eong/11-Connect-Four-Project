/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

// create in-JS board structure, an empty 2D array
function makeBoard() {
  board.length = HEIGHT;
  for (let y = 0; y < board.length; y++) {
    board[y] = [];
    board[y].length = WIDTH;
  }
}

// make HTML table and row of column tops
function makeHtmlBoard() {
  const htmlBoard = document.querySelector('#board');

  // create top row of board for players to click to put their piece into
  // create visible square cells within the top row with unique id to differentiate when player clicks on specific cell
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // create rows for the rest of the board and add visible square cells with unique id to each row
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

// given column x, return top empty spot y (null if filled)
function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) return y;
  }
  return null;
}

// update DOM to place piece into HTML table of board
function placeInTable(y, x) {
  const piece = document.createElement('div');
  piece.classList.add('piece');
  currPlayer === 1 ? piece.classList.add('red') : piece.classList.add('blue');
  const cell = document.getElementById(`${y}-${x}`);
  cell.append(piece);
}

// announce game end, and make board uninteractible
function endGame(msg) {
  alert(msg);
  const top = document.querySelector('#column-top');
  top.removeEventListener('click', handleClick);
}

// handle click of column top to play piece
function handleClick(evt) {
  // get x from ID of clicked cell
  const x = evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if (checkForTie()) {
    return endGame('You tied!');
  }

  // switch players
  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;
}

// check if top row in board is filled
function checkForTie() {
  for (let x = 0; x < board[0].length; x++) {
    if (!board[0][x]) return false;
  }
  return true;
}

// check board cell-by-cell for "does a win start here?"
function checkForWin() {

  // check four cells to see if they're all color of current player
  //  - cells: array of four (y, x) cells
  //  - returns true if all are legal coordinates & all match currPlayer
  function _win(cells) {
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // loop through 2D array board, check each cell
  // create 4 lists of possible connect 4 combinations starting from said cell (horizontal, vertical, and both diagonals)
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
