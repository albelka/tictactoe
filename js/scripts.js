//Back End
function Board() {
  this.board = [[0,0,0], [0,0,0], [0,0,0]];
};

Board.prototype.setCell = function(row, column, player) {
  this.board[row][column] = player;
}

function parseCoordinates(idString) {
  return [idString[0], idString[1]];
}


$(function() {
  var gameBoard = new Board();
  $("div .well").each(function(cell) {
    $(this).click(function() {
      var coordinates = parseCoordinates($(this).attr("id"));
      gameBoard.setCell(coordinates[0], coordinates[1], "x");
      console.log(gameBoard.board);
      $(this).children(".x").show();
      $(this).children(".clear").hide();
    })
  })
})
