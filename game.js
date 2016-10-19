var c;
var ctx;
var game;

$(document).ready(function(){
    c = document.getElementById("game");
    ctx = c.getContext("2d");
    game = {
        map: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        player: {
            posX: 10.0,
            posY: 10.0,
            dirX: 0.0,
            dirY: 0.0,
            rotSpeed: 0.1,
            speed: 0.1,
            fov: 1.0,
            angle: 4
        },
        mapPos: {
            x: 0.0,
            y: 0.0
        },
        ray: {
            dirX: 0.0,
            dirY: 0.0,
            disX: 0.0,
            disY: 0.0,
            dir: 0.0
        },
        deltaX: 0.0,
        deltaY: 0.0,
        wall: 0.0,
        screenWidth: 600.0,
        screenHeight: 300.0,
        fillBg: function(){
            ctx.beginPath();
            ctx.rect(0, 0, game.screenWidth, game.screenHeight / 2);
            ctx.fillStyle = "blue";
            ctx.fill();
            ctx.beginPath();
            ctx.rect(0, game.screenHeight / 2, game.screenWidth, game.screenHeight);
            ctx.fillStyle = "black";
            ctx.fill();
        },
        drawGame: function(){
            checkKeys();
            game.player.dirX = -Math.cos(game.player.angle);
            game.player.dirY = Math.sin(game.player.angle);
            game.player.fov = Math.cos(game.player.angle);
            game.fillBg();
            var i = 0;
            ctx.beginPath();
            while (i < game.screenWidth) {
                game.initRay(i);
                game.calcRay();
                ctx.strokeStyle = "rgba(255, 0, 0, 1)";
                game.writeLines(i);
                i += 1;
            }
            ctx.stroke();

        },
        initRay: function(x){
            var screenPosition = parseFloat(x) * 2 / game.screenWidth - 1;
            game.ray.dirX = game.player.dirX + game.player.dirY * screenPosition;
            game.ray.dirY = game.player.dirY + game.player.fov * screenPosition;
            game.mapPos.x = parseInt(game.player.posX);
            game.mapPos.y = parseInt(game.player.posY);
        },
        calcRay: function(){
            game.deltaX = Math.sqrt(1 + Math.pow(game.ray.dirY, 2) / Math.pow(game.ray.dirX, 2));
            game.deltaY = Math.sqrt(1 + Math.pow(game.ray.dirX, 2) / Math.pow(game.ray.dirY, 2));
            game.ray.disX = (game.ray.dirX < 0) ? (game.player.posX - game.mapPos.x) * game.deltaX : (game.mapPos.x + 1 - game.player.posX) * game.deltaX;
            game.ray.disY = (game.ray.dirY < 0) ? (game.player.posY - game.mapPos.y) * game.deltaY : (game.mapPos.y + 1 - game.player.posY) * game.deltaY;
            while (game.map[game.mapPos.x][game.mapPos.y] == 0) {
                if (game.ray.disX < game.ray.disY) {
                    game.ray.disX += game.deltaX;
                    game.mapPos.x = (game.ray.dirX < 0) ? game.mapPos.x - 1 : game.mapPos.x + 1;
                    game.ray.dir = 0;
                }
                else {
                    game.ray.disY += game.deltaY;
                    game.mapPos.y = (game.ray.dirY < 0) ? game.mapPos.y - 1 : game.mapPos.y + 1;
                    game.ray.dir = 1;
                }
            }
        },
        writeLines: function(x){
            game.getBestSide();
            var length = game.screenHeight / game.wall;
            var yStart = -length / 2 + game.screenHeight / 2;
            var yEnd = length / 2 + game.screenHeight / 2;
            if (game.map[game.mapPos.x][game.mapPos.y] == 1)  {
                ctx.moveTo(x,yStart);
                ctx.lineTo(x, yEnd);
            }

        },
        getBestSide: function(){
            var side = (game.ray.dirY >= 0) ? 0.0 : 1.0;
            var northWall = (game.mapPos.y - game.player.posY + side) / game.ray.dirY;
            side = (game.ray.dirX >= 0) ? 0.0 : 1.0;
            var westWall = (game.mapPos.x - game.player.posX + side) / game.ray.dirX;
            game.wall  = (game.ray.dir >= 1) ? Math.abs(northWall) : Math.abs(westWall);
        },
        keyUp: function(){
            var pos = game.player.posX + game.player.dirX * game.player.speed;
            if (game.map[parseInt(pos)][parseInt(game.player.posY)] == 0)
                game.player.posX += game.player.dirX * game.player.speed;
            pos = game.player.posY + game.player.dirY * game.player.speed;
            if (game.map[parseInt(game.player.posX)][parseInt(pos)] == 0)
                game.player.posY += game.player.dirY * game.player.speed;
        },
        keyDown: function(){
            var pos = game.player.posX - game.player.dirX * game.player.speed;
            if (game.map[parseInt(pos)][parseInt(game.player.posY)] == 0)
                game.player.posX -= game.player.dirX * game.player.speed;
            pos = game.player.posY - game.player.dirY * game.player.speed;
            if (game.map[parseInt(game.player.posX)][parseInt(pos)] == 0)
                game.player.posY -= game.player.dirY * game.player.speed;
        },
        keyLeft: function(){
            var pos = game.player.posX - game.player.dirY * game.player.speed;
            if (game.map[parseInt(pos)][parseInt(game.player.posY)] == 0)
                game.player.posX -= game.player.dirY * game.player.speed;
            pos = game.player.posY - game.player.fov * game.player.speed;
            if (game.map[parseInt(game.player.posX)][parseInt(pos)] == 0)
                game.player.posY -= game.player.fov * game.player.speed;
        },
        keyRight: function(){
            var pos = game.player.posX + game.player.dirY * game.player.speed;
            if (game.map[parseInt(pos)][parseInt(game.player.posY)] == 0)
                game.player.posX += game.player.dirY * game.player.speed;
            pos = game.player.posY + game.player.fov * game.player.speed;
            if (game.map[parseInt(game.player.posX)][parseInt(pos)] == 0)
                game.player.posY += game.player.fov * game.player.speed;
        }
    };

    setInterval(game.drawGame, 16);
});

function checkKeys()
{
    $('#playerPosition').html('X: ' + Math.round(game.player.posX) + ' Y: ' + Math.round(game.player.posY));
    $('#playerAngle').html('Angle: ' + Math.round(game.player.angle));
    if (keyState[32]) {
        game.player.posX = Math.random() * 16 + 1;
        game.player.posY = Math.random() * 16 + 1;
        game.player.angle = Math.random() * 8;
    }
    if (keyState[37])
        game.player.angle -= game.player.rotSpeed;
    if (keyState[39])
        game.player.angle += game.player.rotSpeed;
    if (keyState[90])
        game.keyUp();
    if (keyState[81])
        game.keyLeft();
    if (keyState[83])
        game.keyDown();
    if (keyState[68])
        game.keyRight();

}

var keyState = {};
window.addEventListener('keydown',function(e){
    keyState[e.keyCode || e.which] = true;
},true);
window.addEventListener('keyup',function(e){
    keyState[e.keyCode || e.which] = false;
},true);
