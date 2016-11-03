//Back End
//Board object
function Board() {
  this.board = [[0,0,0], [0,0,0], [0,0,0]];
  this.turnsLeft = 9;
  this.gameOver = false;
};

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

//Returns whether the cell at the given coordinates is blank
Board.prototype.isBlank = function(row, column) {
  if(this.board[row][column]) {
  return false;
  } else {
    return true;
  }
}

//Update UI board and game board object at cell at given coordinates with given player
Board.prototype.makeMark = function(row, column, player) {
  this.board[row][column] = player.mark;
  $("#" + row + column).children("." + player.mark).show();
  $("#" + row + column).children(".clear").hide();
}

Board.prototype.reset = function() {
  this.board = [[0,0,0], [0,0,0], [0,0,0]];
  this.turnsLeft = 9;
  this.gameOver = false;
}


function Player(mark) {
  this.board = [[0,0,0], [0,0,0], [0,0,0]];
  this.winCounter = 0;
  this.mark = mark;
};

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

Player.prototype.reset = function() {
  this.board = [[0,0,0], [0,0,0], [0,0,0]];
}

Player.prototype.setCell = function(row, column) {
  this.board[row][column] = 1;
}

Player.prototype.playerWin = function(board) {
  board.gameOver = true;
  $("#end").show();
  $("#winner").text("Player 1 wins!");
  player1.winCounter++;
  $("#player1WinCounter").text(player1.winCounter);
}


function parseCoordinates(idString) {
  return [parseInt(idString[0]), parseInt(idString[1])];
}

function resetObjects(board, player1, player2) {
  board.reset();
  player1.reset();
  player2.reset();
}

function resetUI() {
  $(".well").children(".x").hide();
  $(".well").children(".o").hide();
  $(".well").children(".clear").show();
  $("#end").hide();
}




//Front End
$(function() {
  //Initialize objects
  var gameBoard = new Board();
  var player1 = new Player("x");
  var player2 = new Player("o");

  //Add click function to each cell
  $("div .well").each(function(cell) {
    $(this).click(function() {
      var coordinates = parseCoordinates($(this).attr("id"));

      //Check to make sure the cell that was clicked is blank and that the game is not over
      if(gameBoard.isBlank(coordinates[0], coordinates[1]) && !gameBoard.gameOver){

        //Update game board and check for a winner (player 1)
        if (gameBoard.turnsLeft % 2 === 1){
          gameBoard.countTurns(gameBoard.isBlank(coordinates[0], coordinates[1]));
          gameBoard.makeMark(coordinates[0], coordinates[1], player1);
          player1.setCell(coordinates[0], coordinates[1]);
          if (player1.checkForWinner()){
            player1.playerWin(gameBoard);
          };

        //Update game board and check for a winner (player 1)
        } else if (gameBoard.turnsLeft % 2 === 0) {
          gameBoard.countTurns(gameBoard.isBlank(coordinates[0], coordinates[1]));
          gameBoard.makeMark(coordinates[0], coordinates[1], player2);
          player2.setCell(coordinates[0], coordinates[1]);
          if (player2.checkForWinner()){
            player2.playerWin(gameBoard);
          };
        }

      //Alert players if they try to select a square when the game is over
      } else if (gameBoard.gameOver) {
        alert("The game is over!");

      //Alert player if they try to select a square that has already been selected
      } else {
        alert("You can't do that!");
      }
    })
  })

  //Reset UI and back-end objects for new game
  $("#resetButton").click(function(){
    resetObjects(gameBoard, player1, player2);
    resetUI();
  })
})
