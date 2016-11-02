//Back End
function Board() {
  this.board = [[0,0,0], [0,0,0], [0,0,0]];
  this.turnsLeft = 9;
};

function Player() {
  this.board = [[0,0,0], [0,0,0], [0,0,0]];
};

Board.prototype.makeMark = function(row, column, player) {
  this.board[row][column] = player;
}

Player.prototype.setCell = function(row, column) {
  this.board[row][column] = 1;
}

Player.prototype.checkForWinner = function() {
  var columnTallys = [0,0,0];
  var isWinner = false;

  //Check row for 3 in a row, count column totals as it loops
  this.board.forEach(function(row) {
    if(row[0] + row[1] + row[2] === 3) {
      isWinner = true;
    }
    for (i = 0; i < 3; i++) {
      if (row[i]) {
        columnTallys[i]++;
      }
    }
  });

  //check diagonals for 3 in a row
  if(this.board[0][0] + this.board[1][1] + this.board[2][2] === 3){
    isWinner = true;
  }
  if(this.board[0][2] + this.board[1][1] + this.board[2][0] === 3){
    isWinner = true;
  }

  //check column tallys for 3 in a row
  columnTallys.forEach(function(columnTally) {
    if (columnTally === 3) {
      isWinner = true;
    }
  });

  return isWinner;
}

function parseCoordinates(idString) {
  return [idString[0], idString[1]];
}

Board.prototype.isBlank = function(row, column) {
  if(this.board[row][column]) {
  return false;
  } else {
    return true;
  }
}

Board.prototype.countTurns = function(isBlank) {
  if (isBlank) {
    this.turnsLeft--;
    console.log(this.turnsLeft);
  } else {
    alert("blah");
  }
}


$(function() {
  var gameBoard = new Board();
  var player1 = new Player();
  var player2 = new Player();
  $("div .well").each(function(cell) {
    $(this).click(function() {
      var coordinates = parseCoordinates($(this).attr("id"));
      if(gameBoard.isBlank(coordinates[0], coordinates[1])){
        gameBoard.countTurns(gameBoard.isBlank(coordinates[0], coordinates[1]));
        gameBoard.makeMark(coordinates[0], coordinates[1], "x");
        player1.setCell(coordinates[0], coordinates[1]);
        $(this).children(".x").show();
        $(this).children(".clear").hide();
        player1.checkForWinner();
      } else {
        alert("This square is taken");
      }
    })
  })
})
