// Call a specified function to update the animation before next repaint
// Optimized by the browser
var animate = window.requestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              function(callback) {
                window.setTimeout(callback, 1000 / 60);
              };

var contact = document.getElementById('paddle');
var score_against = document.getElementById('score_against');
var score_for = document.getElementById('score_for');
var success = document.getElementById('success');
var lose = document.getElementById('lose');
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var width = canvas.width;
var height = canvas.height;
var middle = ((width - 5) / 2);
var keysDown = {};
var runAnimation = {value: true};
var paddles = [];

// Create the paddles and ball objects
var player = new Paddle(20, 100, 20, 100); // Left Paddle
var computer = new Paddle(660, 100, 20, 100); // Right paddle

// Add the paddles to the array
paddles.push(player, computer);

var ball = new Ball(360, 300);
var start = new Button('Start');
var restart = new Button('Restart');

// Global events
window.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 38: // Down Arrow
      keysDown[event.keyCode] = true;
      break;
    case 40: // Up Arrow
      keysDown[event.keyCode] = true;
      break;
    default:
      return; // Do nothing
  }
});

window.addEventListener('keyup', function(event) {
  delete keysDown[event.keyCode];
});

// Add event listener to the canvas
canvas.addEventListener('click', function(event) {
    // Check if the start button has been clicked
    if (event.pageX >= start.x && event.pageY <= start.y + start.h) {
      animate(main);

      // Delete the start button
      // Necessary so as to remove the start button click handlers
      start = {};
    }

    // If the Game is over & the restart button has been clicked
    else if (runAnimation.value === false) {
      if (event.pageX >= restart.x && event.pageY <= restart.y + restart.h) {
        animate(main);
        runAnimation.value = true;
      }

      // Reset the scores
      for (var i = paddles.length - 1; i >= 0; i--) {
        paddles[i].score = 0;
      };
    }
  }, false);

// Determines whether the ball is served heading up or down
function randomDirection() {
  if (Math.random() > 0.5) {
    return -1;
  } else {
    return 1;
  }
}

function Button(text) {
  this.x = width / 2 - 50,
  this.y = height / 2 - 25,
  this.w = 100,
  this.h = 50,

  this.render = function() {
    // Set the line dash back to bold
    ctx.setLineDash([]);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = '2';
    ctx.strokeRect(this.x, this.y, this.w, this.h);

    ctx.font = '18px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStlye = 'white';
    ctx.fillText(text, width / 2, height / 2);
  };
};

function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.radius = 10;

  // Horizontal speed
  // Choose the starting direction randomly
  this.x_speed = 5 * randomDirection();
  this.y_speed = 3 * randomDirection(); // Vertical speed

  this.render = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
    ctx.fillStyle = '#00FFFF';
    ctx.fill();
  };

  this.updatePosition = function(paddle1, paddle2) {
    this.x += this.x_speed;
    this.y += this.y_speed;

    var top_y = this.y - this.radius;
    var right_x = this.x + this.radius;
    var bottom_y = this.y + this.radius;
    var left_x = this.x - this.radius;

    // Hitting the top boundary
    if (this.y - this.radius < 0) {
      this.y = this.radius; // Don't go beyond the boundary
      this.y_speed = -this.y_speed + Math.random(); // Reverse the direction
    } // Hitting the bottom boundary
    else if (this.y + this.radius > height) {
      this.y = height - this.radius; // Set the new position
      this.y_speed = -this.y_speed - Math.random(); // Reverse direction
    }

    // If the computer has scored
    if (this.x < 0) {
      this.x_speed = 5; // Serve the ball to the computer
      this.y_speed = 3 * randomDirection();
      this.x = 360;
      this.y = 300;
      score_against.play();
      paddle2.updateScore();
    } // The player has scored
    else if (this.x > width) {
      this.x_speed = -5; // Serve the ball to the player
      this.y_speed = 3 * randomDirection();
      this.x = 340;
      this.y = 300;
      score_for.play();
      paddle1.updateScore();
    }

    // If the ball is in the left half of the table
    if (right_x < (width / 2)) {
      // The ball has not yet passed the paddle
      // The ball has made contact with the paddle
      // The topmost side of the ball is in the range of the paddle
      // The bottom side of the ball is in the range of the paddle
      if (right_x > paddle1.x && left_x < (paddle1.x + paddle1.width)
        && top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y)
      {
        this.x_speed = Math.abs(this.x_speed) + Math.random();
        this.y_speed += (paddle1.y_speed / 2);
        this.x += this.x_speed;
        contact.currentTime = 0;
        contact.play();
      }
    } else { // The ball is in the right half of the table
      if (right_x > paddle2.x  && left_x < (paddle2.x + paddle2.width)
        && top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y)
      {
        this.x_speed = -(Math.abs(this.x_speed)) - Math.random();
        this.y_speed += (paddle2.y_speed / 2);
        this.x += this.x_speed;
        contact.currentTime = 0;
        contact.play();
      }
    }
  };
}

function Paddle(x, y, wide, long) {
  this.x = x;
  this.y = y;
  this.width = wide;
  this.height = long;
  this.x_speed = 0;
  this.y_speed = 0;
  this.score = 0;

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
      this.y_speed = 0; // The paddle is stagnant
    } // Bottom of the board
    else if (this.y + this.height > height) {
      this.y = height - this.height;
      this.y_speed = 0;
    }
  };

  this.updatePosition = function() {
    if (keysDown[38] === true) {
      this.move(0, -5);
    } else if (keysDown[40] === true) {
      this.move(0, 5);
    }
  };

  // Computer AI
  this.update = function(ball) {
    var y_position = ball.y;

    // Get the position of the ball relative to the paddle
    var diff = -((this.y + (this.height / 2)) - y_position);

    // If the ball is above the paddle
    if (diff < 0 && diff < -4) {
      diff = -5; // max speed up
    } else if (diff > 0 && diff > 4) {
      diff = 5; // max speed down
    }

    this.move(0, diff);
    if (this.y < 0) {
      this.y = 0;
    } else if (this.y + this.height > height) {
      this.y = height - this.height;
    }
  };

  this.updateScore = function() {
    this.score += 1;
    if (this.score === 10) {
      // Stop the animation
      runAnimation.value = false;
      gameOver(paddles);
    }

    return this.score;
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

  // Render the scores
  ctx.fillStyle = '#66FF33';
  ctx.font = '60px "Comic Sans MS", cursive, sans-serif';
  ctx.fillText(player.score, middle - 80, 80);
  ctx.fillText(computer.score, middle + 80, 80);
}

var update = function() {
  ball.updatePosition(player, computer);
  player.updatePosition();
  computer.update(ball);
};

var gameOver = function(players) {
  drawScreen(restart);
  ctx.font = '60px "Comic Sans MS", cursive, sans-serif';
  ctx.textAlign = 'center';

  // Get the player with the highest score
  var win = players[0].score > players[1].score ? players[0] : players[1];

  if (win.x < 100) {
    ctx.fillStyle = '#66FF33';
    ctx.fillText('YOU WIN!!', middle, 150);
    success.play();
  } else {
    ctx.fillStyle = '#FF0000';
    ctx.fillText('YOU LOSE :(', middle, 150);
    lose.play();
  }
}

function main() {
  initialize();
  update();

  // Call animation function before the next repaint
  if (runAnimation.value) {
    animate(main);
  }
}

function drawScreen(button) {
  var line1 = "Control the paddle on the left by using the up and down arrows.";
  var line2 = "The first player to reach a score of 10 wins the game.";
  var line3 = "GOOD LUCK!";
  // Draw the canvas background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  // Render the paddles
  computer.render();
  player.render();

  // Draw the start/restart button
  button.render();

  // Render Instructions
  ctx.font = '30px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStlye = 'white';
  ctx.fillText("INSTRUCTIONS:", width / 2, (height / 2) + 70);

  ctx.font = '20px Arial, sans-serif';
  ctx.fillText(line1, width / 2, (height / 2) + 100);
  ctx.fillText(line2, width / 2, (height / 2) + 130);
  ctx.fillText(line3, width / 2, (height / 2) + 160);
}

window.onload = function() {
  drawScreen(start);
};
