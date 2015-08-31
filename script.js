var c = document.getElementById('myCanvas');
var ctx = c.getContext('2d');
var width = c.width;
var height = c.height;

// Draws the initial screen
function initialize() {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);
}

// ctx.fillStyle = '#ffffff';
// ctx.fillRect(20, 100, 20, 100);

initialize();
