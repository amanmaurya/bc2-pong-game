var c = document.getElementById('myCanvas');
var ctx = c.getContext('2d');
var width = c.width;
var height = c.height;
var middle = ((width - 5) / 2);

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

// Draws the initial screen
function initialize() {
  // Draw the canvas background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  // Create the paddles
  var player = new Paddle(20, 100, 20, 100);
  var computer = new Paddle(660, 100, 20, 100);

  // Render the paddles
  computer.render();
  player.render();
}

// Render the middle dashed line
function renderLineBoundary() {
  ctx.setLineDash([15, 20]);
  ctx.beginPath();
  ctx.strokeStyle = '#ffffff';
  ctx.moveTo(middle, 0);
  ctx.lineWidth = 5;
  ctx.lineTo(middle, height);
  ctx.stroke();
}

function main() {
  initialize();
  renderLineBoundary();
}

main();
