var c = document.getElementById('myCanvas');
var ctx = c.getContext('2d');
var width = c.width;
var height = c.height;

// Draws the initial screen
function initialize() {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  var player = new Paddle(20, 100, 20, 100);
  var computer = new Paddle(660, 100, 20, 100);

  computer.render();
  player.render();
}

function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.render = function() {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

initialize();
