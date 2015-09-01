// Call a specified function to
// update the animation before next repaint
// Optimized by the browser
var animate = window.requestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              function(callback) {
                window.setTimeout(callback, 1000 / 60);
              };

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var width = canvas.width;
var height = canvas.height;
var middle = ((width - 5) / 2);
var keysDown = {};

// Create the paddles and ball objects
var player = new Paddle(20, 100, 20, 100); // Left Paddle
var computer = new Paddle(660, 100, 20, 100); // Right paddle
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
  };

  this.updatePosition = function() {
    this.x += this.x_speed;
    this.y += this.y_speed;

    // Hitting the top boundary
    if (this.y - 10 < 0) {
      this.y = 10; // Don't go beyond the boundary
      this.y_speed = -this.y_speed; // Reverse the direction
    }

    // Hitting the bottom boundary
    else if (this.y - 10 > height) {
      this.y = height - 10; // Set the new position
      this.y_speed = -this.y_speed; // Reverse direction
    }
  };
}

function Paddle(x, y, wide, long) {
  this.x = x;
  this.y = y;
  this.width = wide;
  this.height = long;

  this.render = function() {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };

  this.move = function(x, y) {
    this.x += x;
    this.y += y;

    // Top of the board
    if (this.y < 0) {
      this.y = 0;
    } // Bottom of the board
    else if (this.y + this.height > height) {
      this.y = height - this.height;
    }
  };

  this.updatePosition = function() {
    if (keysDown.ArrowUp === true) {
      this.move(0, -5);
    } else if (keysDown.ArrowDown === true) {
      this.move(0, 5);
    }
  };
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
  player.updatePosition();
};

function main() {
  initialize();
  update();

  // Call animation function before the next repaint
  animate(main);
}

window.onload = function() {
  animate(main);
};

window.addEventListener('keydown', function(event) {
  switch (event.key) {
    case 'ArrowUp':
      keysDown.ArrowUp = true;
      console.log(keysDown);
      break;
    case 'ArrowDown':
      keysDown.ArrowDown = true;
      console.log(keysDown);
      break;
    default:
      return; // Do nothing
  }
});

window.addEventListener('keyup', function(event) {
  delete keysDown[event.key];
});
