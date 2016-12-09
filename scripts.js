// ------------------------
// ----- CONSTRUCTORS -----
// ------------------------
// PLAYER
function Player(name){
	this.name = name;
	this.currentScore = 0;
	this.highscore = 0;
}

// PLAYER METHODS
Player.prototype.highscore = 0;
Player.prototype.updateScore = function(){
	if(this.currentScore > this.highscore){
		this.highscore = this.currentScore;
	}	
}

// HERO
function Hero(x,y,heroImage){
	this.x = x;
	this.y = y;
	this.icon = new Image();
	this.icon.src = heroImage;
}

// HERO METHODS
Hero.prototype.move = function(keysDown, speedModifier = 10){
	if(39 in keysDown){
		if(this.x <= 400){
			this.x += speedModifier;
		}
	}
	if(37 in keysDown){
		if(this.x >= 10){
			this.x -= speedModifier;
		}
	}		
	if(38 in keysDown){
		if(this.y >= 10){
			this.y -= speedModifier;
		}
	}
	if(40 in keysDown){
		if(this.y <= 400){
			this.y += speedModifier;
		}
	}
}

// MONSTER
function Monster(x, y, monsterImage){
	this.x = x;
	this.y = y;
	this.icon = new Image();
	this.icon.src = monsterImage;
}
Monster.prototype.resetLocation = function(){
	var random = Math.random() * 200;
	var random2 = Math.random() * 200;
	this.x = random;
	this.y = random2;
}
Monster.prototype.move = function(){
	// YOUR CODE HERE :)
}

// -------------------------
// --- GENERAL FUNCTIONS ---
// -------------------------
function makeNewPlayer(){
	var playerNameDiv = document.getElementById('player-name');
	var playerName = playerNameDiv.value;
	var player = new Player(playerName);
	playerArray.push(player);
	currentPlayer = playerArray[playerArray.length-1];
	console.log(currentPlayer);
}


function startGame(){
	gameOn = true;
	gameStart = Date.now();
	gameEnd = Date.now() + 3000;
	timerInterval = setInterval(updateTimer, 500);
	currentPlayersScore = 0;
	document.getElementById('score-value').innerHTML = 0;
}

function updateTimer(){
	var newNow = Date.now();
	// Subtract the gameend time from the current time.
	var timeDifference = (gameEnd - newNow) / 1000;
	if(timeDifference < 0){
		clearInterval(timerInterval);
		gameOn = false;
		timeDifference = 0;
		document.getElementById('timer').innerHTML = "Game Over!";
		var playerList = document.getElementById('player-score-list');
		playerList.innerHTML = "";
		for(let i = 0; i < playerArray.length; i++){
			console.log(playerArray[i].highscore);
			// A template literal!
			var string = `<br /> ${playerArray[i].name}: ${playerArray[i].highscore}`;
			playerList.innerHTML += string;
		}
	}else{
		document.getElementById('timer').innerHTML = Math.floor(timeDifference) + " seconds";
	}
}

function checkCollision(hero, monsters){
	var collisionCount = 0;
	for(let i = 0; i < monsters.length; i++){
		if(
			(hero.x <= hero.x + 32)
			&& (hero.y <= monsters[i].y + 32)
			&& (monsters[i].x <= hero.x + 32)
			&& (monsters[i].y <= hero.y + 32)
		){
			collisionCount++;
			monsters[i].resetLocation();
		}
	}
	return collisionCount;
}

function updateScores(){
	currentPlayer.currentScore++;
	document.getElementById('score-value').innerHTML = currentPlayer.currentScore;
	if(currentPlayer.currentScore > highscore){
		highscore = currentPlayer.currentScore;
		document.getElementById('hi-score-value').innerHTML = highscore;
	}
	currentPlayer.updateScore();
}

function gameUpdate(){
	hero.move(keysDown);
	var newCollisions = checkCollision(hero,monsters);
	console.log(newCollisions);
	if(newCollisions > 0){
		updateScores();
	}else{
		// console.log("Hero is not close enough!");
	}
}

// ------------------------
// ------- GLOBALS --------
// ------------------------
var gameStart = 0;
var gameEnd = 0;
var timerInterval;
var playerArray = [];
var currentPlayer;
var highscore = 0;
var currentPlayersScore = 0;
var speedModifier = 1;
var gameOn = false;
var keysDown = [];
var monsters = [];

// ------------------------
// ---- CREATE OBJECTS ----
// ------------------------
var canvas = document.getElementById('game');
canvas.width = 512;
canvas.height = 480;
var context = canvas.getContext('2d')

var backgroundImage = new Image();
backgroundImage.src = "background.png";

var hero = new Hero(100,100,"link1.png");
monsters.push(new Monster(200,100,"monster.png"));

// ------------------------
// ----- LISTENERS -----
// ------------------------
addEventListener('keyup', function(event){
	delete keysDown[event.keyCode];
});

addEventListener('keydown', function(event){
	keysDown[event.keyCode] = true;
});

// KEEP THIS AT THE BOTTOM
function draw(){
	if(gameOn){
		gameUpdate();
	}
	// Draw the images no matter what
	context.drawImage(backgroundImage,0,0);
	context.drawImage(hero.icon, hero.x, hero.y);
	for(let i = 0; i < monsters.length; i++){
		context.drawImage(monsters[i].icon, monsters[i].x, monsters[i].y);
	}
	requestAnimationFrame(draw);
}

draw();