//Back End
function Board() {
  this.board = [[0,0,0], [0,0,0], [0,0,0]];
};

Board.prototype.setCell = function(row, column, player) {
  this.board[row][column] = player;
}


$(function() {
  $("div .well").each(function(cell) {
    $(this).click(function() {
      console.log($(this).attr("id"));
    })
  })
})
