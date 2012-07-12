
var player;
var enemies;
var coins;

var strikes;
var score;

var COIN_SIZE = 15;

var canvas,context;

var updateInterval;

//Comment out if you don't like motion blur
var motionBlur = .5;

function init(){
    
    //Initialize some variables
    strikes = 0;
    score = 0;
    enemies = [];
    coins = [];
    
    //Initialize keyboard manager
    kb.init();
    
    //Find canvas
    canvas = document.getElementById("canvas");
    context = canvas.getContext('2d');
    
    //Create the player object
    player = new GameObject(canvas.width/2,canvas.height/2,"#f0f",25);
    
    //This is bad practice (undocumented properties) but I'm lazy ATM
    player.vx = 0;//Velocity X
    player.vy = 0;//Velocity Y
    player.friction = 1.05;
    player.speed = .5;
    
    //Create enemies
    for (var i = 0;i<20;i++){
        enemies.push( new GameObject(Math.random() * canvas.width,Math.random() * canvas.height,"#f00",10 + Math.random() * 40) );
    }
    
    //Create coins
    for (var i = 0;i<10;i++){
        addCoin();
    }
    
    //Call update 60 times a second
    updateInterval = setInterval(update,1000/60);
}


//Add a coin to the map,make sure it's not places on an enemy
function addCoin(){
    var x = Math.random() * canvas.width;
    var y = Math.random() * canvas.height;
    
    //Check if x and y rest on an enemy
    function hittingEnemy(){
        
        for (var i = enemies.length-1;i>=0;i--){
            var enemy = enemies[i];
            if (Math.abs(enemy.x - x)<(COIN_SIZE + enemy.size)/2 
            && Math.abs(enemy.y - y)<(COIN_SIZE + enemy.size)/2){
                return true;
            }
        }
        
        return false;
    }
    
    while (hittingEnemy()){
        x = Math.random() * canvas.width;
        y = Math.random() * canvas.height;
    }
    
    //Now we can create a coin
    
    coins.push( new GameObject(x,y,"#00f",COIN_SIZE));
    
}

//Update game state
function update(){
    
    //For the player's sliding effect
    player.vx += (kb.getKey("right") - kb.getKey("left")) * player.speed;
    player.vy += (kb.getKey("down") - kb.getKey("up")) * player.speed;
    
    player.vx /= player.friction;
    player.vy /= player.friction;
    
    //Make sure the player doesn't leave the map bounds
    
    player.vx = (player.x + player.vx + player.size/2 > canvas.width && Math.abs(player.vx) * -1) || player.vx;
    player.vx = (player.x + player.vx - player.size/2 < 0 && Math.abs(player.vx)) || player.vx;
    
    player.vy = (player.y + player.vy + player.size/2 > canvas.height && Math.abs(player.vy) * -1) || player.vy;
    player.vy = (player.y + player.vy - player.size/2 < 0 && Math.abs(player.vy)) || player.vy;
    
    player.x += player.vx;
    player.y += player.vy;
    
    //Check if player is near any enemies
    for (var i = enemies.length-1;i>=0;i--){
        var enemy = enemies[i];
        //Check if touching
        if (Math.abs(enemy.x - player.x)<(player.size + enemy.size)/2 
        && Math.abs(enemy.y - player.y)<(player.size + enemy.size)/2){
            
            //Remove enemy and add strike
            enemies.splice(i,1);
            strikes ++;
            if (strikes >= 3){
                gameOver();
            }
            
        }
    }
    
    //Check if player  is near any coins
    for (var i = coins.length-1;i>=0;i--){
        var coin = coins[i];
        //Check if touching
        if (Math.abs(coin.x - player.x)<(player.size + coin.size)/2 
        && Math.abs(coin.y - player.y)<(player.size + coin.size)/2){
            
            //Remove enemy and add strike
            coins.splice(i,1);
            addCoin();
            score += 10;
            
        }
        coin.rotation += 1/8;
    }
    
    render();
};

//Draw game to canvas
function render(){
    
    //If we don't clear the screen entirely,
    //it gives a motion blur effect
    context.globalAlpha = motionBlur || 1;
    
    context.fillStyle = "#fff";
    context.fillRect(0,0,canvas.width,canvas.height);
    
    context.globalAlpha = 1;
    
    
    //Draw Player
    player.render(context);
    
    //Draw enemies
    for (var i = enemies.length-1;i>=0;i--){
        enemies[i].render(context);
    }
    
    //Draw coins
    for (var i = coins.length-1;i>=0;i--){
        coins[i].render(context);
    }
    
    //Draw scoreboard
    context.globalAlpha = .5;
    context.fillStyle = "#000";
    context.fillRect(0,0,canvas.width,30);
    context.globalAlpha = 1;
    
    context.fillStyle = "#fff";
    context.font = "16pt Arial";
    context.textAlign = 'right';
    context.fillText(score,canvas.width-10,20);
    
    //For every strike we'll add a " X" to the strike string
    var strike_string = "";
    for (var i = 0;i<strikes;i++){
        strike_string += " X";
    }
    
    context.fillStyle = "#f00";
    context.textAlign = 'left';
    context.fillText(strike_string,10,20);
    
    
}

//Fired on 3 strikes
function gameOver(){
    //Stop the game from updating
    clearInterval(updateInterval);
    
    //Allow the update function to finish it's run
    setTimeout(function(){
        //Clear canvas
        context.globalAlpha = .8;
        context.fillStyle = "#fff";
        context.fillRect(0,0,canvas.width,canvas.height);
        context.globalAlpha = 1;

        //Display "Game Over"
        context.fillStyle = "#f00";
        context.font = "48pt Arial";
        context.textAlign = "center";
        context.fillText("Game Over",canvas.width/2,canvas.height/2);

        //Display "Press Space to play again"
        context.fillStyle = "#00f";
        context.font = "24pt Arial";
        context.fillText("Press Space to Play Again",canvas.width/2,canvas.height/2+ 60);
        
        //Check for space to restart game
        //Should actually just way for the space key event to be fired
        var interval;
        var interval = setInterval(function(){
            if (kb.getKey("space")){
                clearInterval(interval);
                init(); //reset game
            }
        },1000/60);
        
    },1000/60);
}

window.onload = init;
