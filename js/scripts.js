//Back End
//Board object
function Board() {
  this.board = [[0,0,0], [0,0,0], [0,0,0]];
  this.turnsLeft = 9;
  this.gameCounter = 0;
  this.gameOver = false;
};

Board.prototype.changeHightlight = function(player) {
  if (player.mark === "x") {
    $(".blank").removeClass("xBG");
    $(".blank").addClass("oBG");
  } else if (player.mark === "o") {
    $(".blank").removeClass("oBG");
    $(".blank").addClass("xBG");
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
  $("#" + row + column).removeClass("blank");
  //$("#" + row + column).removeClass("." + player.mark + "BG");
}

Board.prototype.reset = function(player2) {
  this.board = [[0,0,0], [0,0,0], [0,0,0]];
  this.turnsLeft = 9;
  this.gameOver = false;
  if (((this.gameCounter + this.turnsLeft ) % 2 === 1) || (!player2.isHuman)) {
    $(".well").addClass("xBG");
  } else {
    $(".well").addClass("oBG");
  }

  console.log("this.board: ", this.board);
  console.log("this.turnsLeft: ", this.turnsLeft);
  console.log("this.gameOver: ", this.gameOver);
}


function Player(mark, isHuman) {
  this.board = [[0,0,0], [0,0,0], [0,0,0]];
  this.winCounter = 0;
  this.mark = mark;
  this.isHuman = isHuman;
  this.squaresRemaining = ["00", "01", "02", "10", "11", "12", "20", "21", "22"];
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

Player.prototype.computerTurn = function(board, player1) {
  var adjacentRow = this.twoInARow();
  var opponentAdjacentRow = player1.twoInARow();

  if ((adjacentRow) && (this.squaresRemaining.length > 0)) {
    adjacentRow = findMatchingElement(adjacentRow, this.squaresRemaining);
    if (adjacentRow.length > 0) {
      var cpuChoice = this.pickRandomSquare(adjacentRow);
    } else {
      var cpuChoice = this.pickRandomSquare(this.squaresRemaining);
    }

  } else if ((opponentAdjacentRow) && (this.squaresRemaining.length > 0)) {
    console.log("adjacent row: ", opponentAdjacentRow);
    opponentAdjacentRow = findMatchingElement(opponentAdjacentRow, this.squaresRemaining);
    if (opponentAdjacentRow.length > 0) {
      var cpuChoice = player1.pickRandomSquare(opponentAdjacentRow);
      console.log("cpuChoice: ", cpuChoice);
    } else {
      var cpuChoice = player1.pickRandomSquare(this.squaresRemaining);
    }

  } else if (board.board[1][1] === 0) {
    var cpuChoice = "11";

  } else if (board.gameOver) {
    var cpuChoice = false;

  } else {
    console.log("not adjacentRow");
    var cpuChoice = player1.pickRandomSquare(this.squaresRemaining);
  }
  if (cpuChoice) {
    board.countTurns(board.isBlank(cpuChoice[0], cpuChoice[1]));
    board.makeMark(cpuChoice[0], cpuChoice[1], this);
    board.changeHightlight(this);
    this.setCell(cpuChoice[0], cpuChoice[1]);
    this.popCell(cpuChoice[0], cpuChoice[1]);
    if (this.checkForWinner()) {
      this.playerWin(board);
      $(".blank").removeClass(this.mark + "BG");
      $(".blank").removeClass(player1.mark + "BG");
    }
  }
}

Player.prototype.pickRandomSquare = function(possibleList) {
  var choiceIndex = Math.floor(Math.random() * possibleList.length);
  console.log("choice index: ", choiceIndex);
  var idString = possibleList[choiceIndex];
  console.log("idString: ", idString);
  return [idString[0], idString[1]];
}

Player.prototype.playerWin = function(board) {
  board.gameOver = true;
  board.gameCounter++;
  $("#end").show();
  $("#winner").text(this.mark.toUpperCase() + " wins!");
  this.winCounter++;
  $("#" + this.mark + "WinCounter").text(this.winCounter);
}

Player.prototype.popCell = function(row, column) {
  var idString = row.toString() + column.toString();
  this.squaresRemaining = this.squaresRemaining.filter(function(index) {
    return index != idString;
  });
}

Player.prototype.reset = function() {
  this.board = [[0,0,0], [0,0,0], [0,0,0]];
  this.squaresRemaining = ["00", "01", "02", "10", "11", "12", "20", "21", "22"];
}

Player.prototype.setCell = function(row, column) {
  this.board[row][column] = 1;
}

Player.prototype.twoInARow = function() {
  var adjacentRow = [];

  for (rowIndex = 0; rowIndex < 3; rowIndex++) {
    if (this.board[rowIndex][0] + this.board[rowIndex][1] + this.board[rowIndex][2] === 2) {
      for (elementIndex = 0; elementIndex < 3; elementIndex++) {
        adjacentRow.push(rowIndex.toString() + elementIndex.toString());
      }
    }
  }

  console.log("two in a row: ", adjacentRow);
  if (adjacentRow.length > 0) {
    return adjacentRow;
  } else {
    return false;
  }
}

function findMatchingElement(array1, array2) {
  console.log("array1: ", array1);
  console.log("array2: ", array2);
  var matchingElements = [];
  for (i = 0; i < array1.length; i++) {
    for (j = 0; j < array2.length; j++) {
      if (array1[i] === array2[j]) {
        matchingElements.push(array1[i]);
      }
    }
  }

  console.log("matching elements: ", matchingElements);
  return matchingElements;
}

function parseCoordinates(idString) {
  return [parseInt(idString[0]), parseInt(idString[1])];
}

function resetObjects(board, player1, player2) {
  board.reset(player2);
  player1.reset();
  player2.reset();
}

function resetUI() {
  $(".well").children(".x").hide();
  $(".well").children(".o").hide();
  $(".well").children(".clear").show();
  $("#end").hide();
  $(".well").addClass("blank");
  $(".well").removeClass("oBG");
  $(".well").removeClass("xBG");
}

function generateUIBoard() {
  for (row = 0; row < 3; row++) {
    $(".gridContainer").append('<div class="row" id="'+ row+ '"></div>');
  }
  $(".gridContainer .row").each(function(row) {
    for (column = 0; column < 3; column++) {
      $(this).append( '<div class="col-xs-4">'+
                        '<div id="'+
                        $(this).attr("id") + column+
                        '" class="well blank">'+
                          '<img src="img/clear.png" class="clear" alt="a blank image">'+
                          '<img src="img/X.png" class="x" alt="a picture of an x">'+
                          '<img src="img/O.png" class="o" alt="a picture of an o">'+
                        '</div>'+
                      '</div>')
    }
  })
}



//Front End
$(function() {
  generateUIBoard();
  var gameBoard;
  var player1;
  var player2;

  $("#human").click(function() {
    $(".gridContainer").show();
    $(".startScreen").hide();

    //Initialize objects
    gameBoard = new Board();
    player1 = new Player("x", true);
    player2 = new Player("o", true);
    $("#resetButton").show();
    $(".blank").addClass(player1.mark + "BG");
  })

  $("#computerEasy").click(function() {
    $(".gridContainer").show();
    $(".startScreen").hide();

    //Initialize objects
    gameBoard = new Board();
    player1 = new Player("x", true);
    player2 = new Player("o", false);
    $("#resetButton").show();
    $(".blank").addClass(player1.mark + "BG");
  })

  $("#computerHard").click(function() {
    $(".gridContainer").show();
    $(".startScreen").hide();
    alert("Hard AI is not finished.  How about a game against an easy computer?")

    //Initialize objects
    gameBoard = new Board();
    player1 = new Player("x", true);
    player2 = new Player("o", false);
    $("#resetButton").show();
    $(".blank").addClass(player1.mark + "BG");
  })

  //Add click function to each cell
  $("div .well").each(function(cell) {
    $(this).click(function() {
      var coordinates = parseCoordinates($(this).attr("id"));

      //Check to make sure the cell that was clicked is blank and that the game is not over
      if(gameBoard.isBlank(coordinates[0], coordinates[1]) && !gameBoard.gameOver) {

        //Update game board and check for a winner (player 1)
        if ((gameBoard.turnsLeft + gameBoard.gameCounter) % 2 === 1) {
          gameBoard.countTurns(gameBoard.isBlank(coordinates[0], coordinates[1]));
          gameBoard.makeMark(coordinates[0], coordinates[1], player1);
          gameBoard.changeHightlight(player1);
          player1.setCell(coordinates[0], coordinates[1]);
          player2.popCell(coordinates[0], coordinates[1]);
          if (player1.checkForWinner()) {
            player1.playerWin(gameBoard);
            $(".blank").removeClass(player2.mark + "BG");
            $(".blank").removeClass(player1.mark + "BG");
          } else if (!player2.isHuman) {
            player2.computerTurn(gameBoard, player1);
          }

        //Update game board and check for a winner (player 2)
        } else if ((gameBoard.turnsLeft + gameBoard.gameCounter) % 2 === 0 && player2.isHuman) {
          gameBoard.countTurns(gameBoard.isBlank(coordinates[0], coordinates[1]));
          gameBoard.makeMark(coordinates[0], coordinates[1], player2);
          gameBoard.changeHightlight(player2);
          player2.setCell(coordinates[0], coordinates[1]);
          player2.popCell(coordinates[0], coordinates[1]);
          if (player2.checkForWinner()) {
            player2.playerWin(gameBoard);
            $(".blank").removeClass(player2.mark + "BG");
            $(".blank").removeClass(player1.mark + "BG");
          }

        } else if ((gameBoard.turnsLeft + gameBoard.gameCounter) % 2 === 0 && !player2.isHuman) {
          gameBoard.countTurns(gameBoard.isBlank(coordinates[0], coordinates[1]));
          gameBoard.makeMark(coordinates[0], coordinates[1], player1);
          gameBoard.changeHightlight(player1);
          player1.setCell(coordinates[0], coordinates[1]);
          player2.popCell(coordinates[0], coordinates[1]);
          if (player1.checkForWinner()) {
            player1.playerWin(gameBoard);
            $(".blank").removeClass(player2.mark + "BG");
            $(".blank").removeClass(player1.mark + "BG");
          } else {
            player2.computerTurn(gameBoard, player1);
          }
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
    resetUI();
    resetObjects(gameBoard, player1, player2);
  })
})
