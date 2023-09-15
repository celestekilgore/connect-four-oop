"use strict";
/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
  constructor(p1,p2,height, width){
    this.height = height;
    this.width = width;
    this.currPlayer = p1;
    this.p1 = p1;
    this.p2 = p2;
    this.board = [];
    this.gameOver = false;
    this.makeBoard();
    this.makeHtmlBoard();

  }

  /** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */
  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
      // this.board.push(Array.from({ length: this.width }, function() {return null;}));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

makeHtmlBoard() {
  //TODO: clear board
  const board = document.getElementById('board');
  board.innerHTML = '';

  // make column tops (clickable area for adding a piece to that column)
  const top = document.createElement('tr');
  top.setAttribute('id', 'column-top');

  for (let x = 0; x < this.width; x++) {
    const headCell = document.createElement('td');
    headCell.setAttribute('id', x);
    headCell.addEventListener('click', this.handleClick.bind(this));
    top.append(headCell);
  }

  board.append(top);

  // make main part of board
  for (let y = 0; y < this.height; y++) {
    const row = document.createElement('tr');

    for (let x = 0; x < this.width; x++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `c-${y}-${x}`);
      row.append(cell);
    }

    board.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

findSpotForCol(x) {
  console.log("board: ", this.board)
  for (let y = this.height - 1; y >= 0; y--) {
    if (!(this.board[y][x])) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

placeInTable(y, x) {
  const piece = document.createElement('div');
  if (this.currPlayer === this.p1) {
    piece.style.backgroundColor = this.p1.color;
  } else {
    piece.style.backgroundColor = this.p2.color;
  }
  piece.classList.add('piece');
  //piece.classList.add(this.currPlayer);

  const spot = document.getElementById(`c-${y}-${x}`);
  spot.append(piece);
}

/** endGame: announce game end */

endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

handleClick(evt) {
  // get x from ID of clicked cell
  if(this.gameOver === true){
    return;
  }
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = this.findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  this.board[y][x] = this.currPlayer;
  this.placeInTable(y, x);

  // check for win
  if (this.checkForWin()) {
    return this.endGame(`Player ${this.currPlayer.color} won!`);
  }

  // check for tie
  if (this.board.every(row => row.every(cell => cell))) {
    return this.endGame('Tie!');
  }

  // switch players
  this.currPlayer = this.currPlayer === this.p1 ? this.p2 : this.p1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

checkForWin() {
  console.log("this is:",this);
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < this.height &&
        x >= 0 &&
        x < this.width &&
        this.board[y][x] === this.currPlayer
    );
  }
  const win = _win.bind(this);
  console.log('win function: ', win)

  // const _win = (cells) => {
  //   console.log("cells:",cells);
  //   return cells.every(
  //   ([y, x]) =>
  //     y >= 0 &&
  //     y < this.height &&
  //     x >= 0 &&
  //     x < this.width &&
  //     this.board[y][x] === this.currPlayer
  // )};

  for (let y = 0; y < this.height; y++) {
    for (let x = 0; x < this.width; x++) {
      // get "check list" of 4 cells (starting here) for each of the different
      // ways to win
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // find winner (only checking each win-possibility as needed)
      // console.log("Horizontal: ", _win(horiz))
      // console.log("Vertical: ", _win(vert))
      // console.log("DiagR: ", _win(diagDR))
      // console.log("DiagL: ", _win(diagDL))
      // if ( win(horiz) || win(vert) || win(diagDR) || win(diagDL) ) {
      if ( _win.call(this,horiz) || _win.call(this,vert) || _win.call(this,diagDR) || _win.call(this,diagDL) ) {
        this.gameOver = true;
        return true;
      }
    }
  }
}

}

class Player{
  constructor(color){
    this.color = color;
  }
}
//add event listener
 let startButton = document.getElementById("start-button")

 if(startButton)
 startButton.addEventListener("click", (e) => {
  e.preventDefault();
  const p1Color = document.querySelector("#p1-input");
  const p2Color = document.querySelector("#p2-input");
  const p1 = new Player(p1Color.value);
  const p2 = new Player(p2Color.value);
  new Game(p1, p2, 6, 7);
 });


