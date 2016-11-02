//Back End
function Board() {
  this.board = [[0,0,0], [0,0,0], [0,0,0]];
  this.turnsLeft = 9;
  this.gameOver = false;
};

function Player() {
  this.board = [[0,0,0], [0,0,0], [0,0,0]];
  this.winCounter = 0;
};

Board.prototype.makeMark = function(row, column, player) {
  this.board[row][column] = player;
  if(player === "x"){
    $("#" + row + column).children(".x").show();
    $("#" + row + column).children(".clear").hide();
  } else if (player === "o") {
    $("#" + row + column).children(".o").show();
    $("#" + row + column).children(".clear").hide();
  }
}

//Will count the current turn and end game on a tie
Board.prototype.countTurns = function(isBlank) {
  if (isBlank) {
    this.turnsLeft--;
  }
  if (this.turnsLeft === 0) {
    this.gameOver = true;
    $("#end").show();
    $("#winner").text("Tie game!");
  }
}

Board.prototype.isBlank = function(row, column) {
  if(this.board[row][column]) {
  return false;
  } else {
    return true;
  }
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
  return [parseInt(idString[0]), parseInt(idString[1])];
}



$(function() {
  var gameBoard = new Board();
  var player1 = new Player();
  var player2 = new Player();
  $("div .well").each(function(cell) {
    $(this).click(function() {
      var coordinates = parseCoordinates($(this).attr("id"));
      if(gameBoard.isBlank(coordinates[0], coordinates[1]) && !gameBoard.gameOver){
        if (gameBoard.turnsLeft % 2 === 1){
          gameBoard.countTurns(gameBoard.isBlank(coordinates[0], coordinates[1]));
          gameBoard.makeMark(coordinates[0], coordinates[1], "x");
          player1.setCell(coordinates[0], coordinates[1]);
          if (player1.checkForWinner()){
            gameBoard.gameOver = true;
            $("#end").show();
            $("#winner").text("Player 1 wins!");
            player1.winCounter++;
            $("#player1WinCounter").text(player1.winCounter);
          };
        } else if (gameBoard.turnsLeft % 2 === 0) {
          gameBoard.countTurns(gameBoard.isBlank(coordinates[0], coordinates[1]));
          gameBoard.makeMark(coordinates[0], coordinates[1], "o");
          player2.setCell(coordinates[0], coordinates[1]);
          if (player2.checkForWinner()){
            gameBoard.gameOver = true;
            $("#end").show();
            $("#winner").text("Player 2 wins!");
            player2.winCounter++;
            $("#player2WinCounter").text(player2.winCounter);
          };
        }
      } else if (gameBoard.gameOver) {
        alert("The game is over!");
      } else {
        alert("You can't do that!");
      }
    })
  })

  $("#resetButton").click(function(){
    $(".well").children(".x").hide();
    $(".well").children(".o").hide();
    $(".well").children(".clear").show();
    $("#end").hide();
    gameBoard.board = [[0,0,0], [0,0,0], [0,0,0]];
    player1.board = [[0,0,0], [0,0,0], [0,0,0]];
    player2.board = [[0,0,0], [0,0,0], [0,0,0]];
    gameBoard.turnsLeft = 9;
    gameBoard.gameOver = false;
  })
})
