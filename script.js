// Call a specified function to
// update the animation before next repaint
// Optimized by the browser
var animate = window.requestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              function(callback) {
                window.setTimeout(callback, 1000 / 60)
              };

var c = document.getElementById('myCanvas');
var ctx = c.getContext('2d');
var width = c.width;
var height = c.height;
var middle = ((width - 5) / 2);

// Create the paddles and ball objects
var player = new Paddle(20, 100, 20, 100);
var computer = new Paddle(660, 100, 20, 100);
var ball = new Ball(360, 300);

function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.radius = 10;
  this.x_speed = 5; // Horizontal speed
  this.y_speed = 1; // Vertical speed

  this.render = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
    ctx.fillStyle = '#00FFFF';
    ctx.fill();
  }

  this.updatePosition = function() {
    this.x += this.x_speed;
    this.y += this.y_speed;
  }
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

// Draws the initial screen
function initialize() {
  // Draw the canvas background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  // Render the paddles
  computer.render();
  player.render();
  ball.render();

  // Render the line boundary
  ctx.setLineDash([15, 20]);
  ctx.beginPath();
  ctx.strokeStyle = '#ffffff';
  ctx.moveTo(middle, 0);
  ctx.lineWidth = 5;
  ctx.lineTo(middle, height);
  ctx.stroke();
}

var update = function() {
  ball.updatePosition();
};

function main() {
  initialize();
  update();

  // Call animation function before the next repaint
  animate(main);
};

window.onload = function() {
  animate(main);
};
