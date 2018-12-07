const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// initializing main dimensions
canvas.width = window.innerWidth/1.5;
canvas.height = window.innerHeight;

// initializing objects
const me = new Image();
me.src = './me.png';

const enemy1 = new Image();
enemy1.src = "./enemy1.png";

const enemy2 = new Image();
enemy2.src = "./enemy2.png";

const background = new Image();
background.src = "https://ak5.picdn.net/shutterstock/videos/32781985/thumb/1.jpg"

// utility function for random numbers
const rand = function(max) {
  return Math.floor(Math.random() * Math.floor(max));
};

// score and speed depending on it
let score = 0;
let speed = score/5;

// score and speed increase with time
setInterval(function() {score += 1; speed = score/20}, 1000)

// getting apppe dimensions
const floor = canvas.height - 100;
const leftWall = 50;
const rightWall = canvas.width - 120;
const topWall = canvas.height/2;

// plane drawer
const plane = {
    image: me,
    x: (rightWall + leftWall)/2,
    y: floor,
    width: 50,
    height: 50,
    xDelta: 0,
    yDelta: 0,

    draw: function() {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
    },

    update: function() {
    	
		this.y -= this.yDelta;
		
		if (this.yDelta > 0) {
			this.yDelta -= 1;
		}
		if (this.yDelta < 0) {
			this.yDelta += 1;
		}

		this.x += this.xDelta
		
		if (this.xDelta > 0) {
			this.xDelta -= 1;
		}
		if (this.xDelta < 0) {
			this.xDelta += 1;
		}

    }
};

// initialize enemies
var enemies = [];

// recursive creation of enemies
const createEnemies = function(count, canvasWidth, canvasHeight) {   
  if (count === 0) {
    return enemies;
  }

  const enemy = {
    image: [enemy1, enemy2][rand(2)],
    x: rand(canvasWidth-50),
    y: rand(canvasHeight/3),
    width: 50,
    height: 50,
    xDelta: 3,
    yDelta: 3,

    draw: function() {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
    },
    
    update: function() {
    	this.y += this.yDelta + speed

    	if (this.y > floor+25) {
    		this.y = 0;
    		this.x = rand(canvasWidth);
    	}

    	if (plane.y > this.y - 40 && plane.y < this.y + 40 && plane.x > this.x - 30 && plane.x < this.x + 30) {
    		alert("Game Over! Rest in Pepsi! Your score is: " + score);
    		score = 0;
			
			context.clearRect(0, 0, canvas.width, canvas.height);

			plane.x = (rightWall + leftWall)/2;
    		plane.y = floor
			
			enemies = [];
			createEnemies(15, rightWall, floor)
    	}
    }
  };

  enemies[enemies.length] = enemy;
  createEnemies(count - 1, rightWall, floor);
};

createEnemies(15, rightWall, floor);

// utility function for drawing an array of canvas elements
const drawArray = function(arr, index) {

	if(index === 0) {
	    return;
	}
	
	arr[index].draw();
	arr[index].update();

	drawArray(arr, index-1)
	
};

// refresh rate
var fps = 60;

// main application loop
const loop = function() {
	context.clearRect(0, 0, canvas.width, canvas.height);

  	context.drawImage(background, 0, 0, rightWall + 50, floor + 70);

  	context.font = "20pt Calibri"
	context.fillText("Score: " + score, rightWall - 50, 50);
	
	plane.draw();
  	plane.update();

  	drawArray(enemies, enemies.length - 1);

	setTimeout(function() {
	    requestAnimationFrame(loop);
	}, 1 / fps);
};

// run main app
loop();

// keycodes
const leftKey = 37;
const upKey = 38;
const rightKey = 39;
const downKey = 40;

// event listener for keydown
document.addEventListener('keydown', function(event) {
	// go right
	if(event.keyCode === rightKey) {
	  	if (plane.x < rightWall) {
	    	plane.xDelta = 5;	
	    }
	}

	// go left
	if (event.keyCode === leftKey) {
	 	if (plane.x > leftWall) {
	    	plane.xDelta = -(5);
	    }
	} 

	// go up
	if (event.keyCode === upKey) {
		if (plane.y > topWall) {
	      	plane.yDelta = 5;
	    }
	}

	// go down
	if (event.keyCode === downKey) {
		if (plane.y < floor) {
	      	plane.yDelta = -(5);
	    }
	}
}, false);