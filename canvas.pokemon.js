/**
 * Pokemon HTML5 canvas game
 * @version 1.0.0
 * @author Panagiotis Vourtsis <vourtsis_pan@hotmail.com>
 */
window.onload = function() {
    "use strict";

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var w = document.getElementById("canvas").offsetWidth;
    var h = document.getElementById("canvas").offsetHeight;
    var terrainImageLoaded = false, houseImageLoaded = false, pokeballImageLoaded = false, playerImageLoaded = false;
    var objectSizes = 20;
    var speed = 100;
    var modifier = 100;
    var score = 0;

    //terrain image
    var terrainImage = new Image();
    terrainImage.onload = function () {
        terrainImageLoaded = true;
        assetsLoaded();
    };
    terrainImage.src = "images/pokemon_terrain.jpg";

    //house image
    var houseImage = new Image();
    houseImage.onload = function () {
        houseImageLoaded = true;
        assetsLoaded();
    };
    houseImage.src = "images/house.png";

    //main sound
    var mainTheme = new Audio("sounds/main-theme.mp3");
    mainTheme.loop = true;
    mainTheme.volume = 0.5;
    mainTheme.play();

    //pokeball-selection
    var pokePick = new Audio("sounds/pickup.mp3");
    pokePick.volume = 0.8;

    //player image
    var playerImage = new Image();
    playerImage.onload = function () {
        pokeballImageLoaded = true;
        assetsLoaded();
    };
    playerImage.src = "images/player.png";

    //pokeball image
    var pokeballImage = new Image();
    pokeballImage.onload = function () {
        playerImageLoaded = true;
        assetsLoaded();
    };
    pokeballImage.src = "images/pokeball.png";

    /**
     * It will hold all the pockeball data like x and y axis position
     * sprite position and item distance is for determine which item is selected from the sprite - @todo future use for knowing on score which one player picked
     * Also hold the generate position function that generates random positions if there is no collision.
     * @Object
     * @name pokeball
     */
    var pokeball = {
        x: 0,
        y: 0,
        spritePosition: 0,
        spriteItemDistance: 33
    };
    pokeball.generatePosition = function() {
        do {
            pokeball.x = Math.floor(Math.random() * 20) + 1;
            pokeball.y = Math.floor(Math.random() * 16) + 4;
        } while(check_collision(pokeball.x, pokeball.y));

        pokeball.spritePosition = Math.floor(Math.random() * 4) + 0;// get position from 0-4
    };

    /**
     * Holds all the player's info like x and y axis position, his current direction (facing).
     * I have also incuded an object to hold the sprite position of each movement so i can call them
     * I also included the move function in order to move the player - all the functionality for the movement is in there
     * @Object
     * @name pokeball
     */
    var player = {
        x: Math.round((w/2)/objectSizes),
        y: Math.round((h/2)/objectSizes),
        currentDirection: "stand",
        direction: {
            "stand" : {
                x: 0,
                y: 0
            },
            "down-1" : {
                x: 17,
                y: 0
            },
            "down-2" : {
                x: 34,
                y: 0
            },
            "up-1" : {
                x: 125,
                y: 0
            },
            "up-2" : {
                x: 142,
                y: 0
            },
            "left-1" : {
                x: 69,
                y: 0
            },
            "left-2" : {
                x: 87,
                y: 0
            },
            "right-1" : {
                x: 160,
                y: 0
            },
            "right-2" : {
                x: 178,
                y: 0
            }
        }
    };
    player.move = function(direction) {

        /**
         * A temporary object to hold the current x, y so if there is a collision with the new coordinates to fallback here
         */
        var hold_player = {
            x: player.x,
            y: player.y
        };

        /**
         * Decide here the direction of the user and do the neccessary changes on the directions
         */
        switch(direction) {
            case "left":
                player.x -= speed / modifier;
                if(player.currentDirection == "stand") {
                    player.currentDirection = "left-1";
                } else if(player.currentDirection == "left-1") {
                    player.currentDirection = "left-2";
                } else if(player.currentDirection == "left-2") {
                    player.currentDirection = "left-1";
                } else {
                    player.currentDirection = "left-1";
                }
                break;
            case "right":
                player.x += speed / modifier;
                if(player.currentDirection == "stand") {
                    player.currentDirection = "right-1";
                } else if(player.currentDirection == "right-1") {
                    player.currentDirection = "right-2";
                } else if(player.currentDirection == "right-2") {
                    player.currentDirection = "right-1";
                } else {
                    player.currentDirection = "right-1";
                }
                break;
            case "up":
                player.y -= speed / modifier;

                if(player.currentDirection == "stand") {
                    player.currentDirection = "up-1";
                } else if(player.currentDirection == "up-1") {
                    player.currentDirection = "up-2";
                } else if(player.currentDirection == "up-2") {
                    player.currentDirection = "up-1";
                } else {
                    player.currentDirection = "up-1";
                }

                break;
            case "down":
                player.y += speed / modifier;

                if(player.currentDirection == "stand") {
                    player.currentDirection = "down-1";
                } else if(player.currentDirection == "down-1") {
                    player.currentDirection = "down-2";
                } else if(player.currentDirection == "down-2") {
                    player.currentDirection = "down-1";
                } else {
                    player.currentDirection = "down-1";
                }

                break;
        }

        /**
         * if there is a collision just fallback to the temp object i build before while not change back the direction so we can have a movement
         */
        if(check_collision(player.x, player.y)) {
            player.x = hold_player.x;
            player.y = hold_player.y;
        }

        /**
         * If player finds the coordinates of pokeball the generate new one, play the sound and update the score
         */
        if(player.x == pokeball.x && player.y == pokeball.y) { // found a pokeball !! create a new one
            console.log("found a pokeball of "+pokeball.spritePosition+"! Bravo! ");
            pokePick.pause();
            pokePick.currentTime = 0;
            pokePick.play();
            score += 1;
            pokeball.generatePosition();
        }

        update();
    };

    /**
     * Handle all the updates of the canvas and creates the objects
     * @function
     * @name update
     */
    function update() {
        ctx.drawImage(terrainImage, 0, 0);
        ctx.drawImage(houseImage, 80, 60);

        //Genboard
        board();

        //pokeball
        ctx.drawImage(pokeballImage, pokeball.spritePosition*pokeball.spriteItemDistance, 0, objectSizes, objectSizes, pokeball.x * objectSizes, pokeball.y * objectSizes, objectSizes, objectSizes);

        //player
        console.log("y:",(player.y * objectSizes)/objectSizes);
        console.log("x",(player.x * objectSizes)/objectSizes);
        ctx.drawImage(playerImage, player.direction[player.currentDirection].x, player.direction[player.currentDirection].y, objectSizes-2, objectSizes, player.x * objectSizes, player.y * objectSizes, objectSizes, objectSizes);
    }

    /**
     * Our function that decides if there is a collision on the objects or not
     * @function
     * @name check_collision
     * @param {Integer} x - The x axis
     * @param {Integer} y - The y axis
     */
    function check_collision(x, y) {
        var foundCollision = false;

        if(((x > 3 && x < 9) && y == 6) || ((x > 4 && x < 9) && (y == 5 || y == 4 || y == 3))) { //collision on house
            console.log("on house");
            foundCollision = true;
        }

        if((x<1 || x>20) ||
            (y<2 || y>20) ||
            ((y > 0 && y < 4) && (x == 20 || x == 19)) || //right corner
            ((y > 0 && y < 4) && (x == 2 || x == 3)) || //left corner
            ((y > 18) && (x == 2 || x == 3)) || //left corner
            ((x > 17) && (y == 19 || y == 20)) || //left corner
            ((x > 19) && (y == 17 || y == 18)) //left corner 2
        ) {
            console.log("lost on the woods");
            foundCollision = true
        }

        return foundCollision;
    }

    /**
     * Here we are creating our board on the bottom right with our score
     * @todo maybe some mute button for the future?
     * @function
     * @name board
     */
    function board() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(w-100, h-70, 100, 70);

        ctx.font = "18px Arial";
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.fillText("You Found",w-93, h-45);

        ctx.font = "14px Arial";
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.fillText(score + " poketballs",w-85, h-25);
    }

    /**
     * Decide here if all the assets are ready to start updating
     * @function
     * @name assetsLoaded
     */
    function assetsLoaded() {
        if(terrainImageLoaded == true && houseImageLoaded == true && pokeballImageLoaded == true && playerImageLoaded == true) {
            pokeball.generatePosition();
            update();
        }
    }

    /**
     * Assign of the arrow keys to call the player move
     */
    document.onkeydown = function(e) {
        e = e || window.event;

        if(e.keyCode == "37") player.move("left");
        else if(e.keyCode == "38") player.move("up");
        else if(e.keyCode == "39") player.move("right");
        else if(e.keyCode == "40") player.move("down");
    };
};