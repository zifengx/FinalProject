﻿/**
Game Name: Car Crash
Name: Zifeng Xu
Last Modify by: Zifeng
Date Last Modified: 2014, Nov.15th
Description: This is a car crash game. Hit the rasberry to earn 100 points. Hit the bomb will lose one live.
Rivision History: see https://github.com/ZifengX/FinalProject.git
**/
/// <reference path="constants.ts" />
/// <reference path="managers/asset.ts" />
/// <reference path="objects/gameobject.ts" />
/// <reference path="objects/meteorolite.ts" />
/// <reference path="objects/coin.ts" />
/// <reference path="objects/univers.ts" />
/// <reference path="objects/plane.ts" />
/// <reference path="objects/scoreboard.ts" />
/// <reference path="objects/label.ts" />
/// <reference path="objects/button.ts" />
/// <reference path="objects/enemy.ts" />
/// <reference path="objects/bullet.ts" />
/// <reference path="managers/collision.ts" />
/// <reference path="managers/bulletmanager.ts" />
/// <reference path="states/play.ts" />
/// <reference path="states/menu.ts" />
/// <reference path="states/gameover.ts" />
/// <reference path="states/instructions.ts" />
//game containers
var stage;
var game;

// game objects
var univers;
var plane;
var coin;
var meteorolites = [];
var enemies = [];
var scoreboard;

// object managers
var collision;
var bulletManager;

var tryAgain;
var playButton;

// global game variables
var screenScale;
var currentState;
var currentStateFunction;
var gamePlaying = false;
var swirl;

// Preload function - Loads Assets and initializes game;
function preload() {
    managers.Assets.init();
    managers.Assets.loader.addEventListener("complete", init);

    stage = new createjs.Stage(document.getElementById('canvas'));
    stage.enableMouseOver(30);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", gameLoop);
    optimizeForMobile();
    showStartScreen();
}

//Start Screen
function showStartScreen() {
    game = new createjs.Container();
    var screenFont = "100px Consolas";
    var introPlaneWidth = 447;
    var introPlaneHeight = 195;

    // Add univers Image
    var introUnivers = new createjs.Bitmap("assets/images/univers.jpg");
    game.addChild(introUnivers);

    // Add Swirl
    swirl = new createjs.Bitmap("assets/images/swirl.png");

    swirl.regX = 512;
    swirl.regY = 512;
    swirl.y = stage.canvas.height * 0.5;
    swirl.x = stage.canvas.width * 0.5;
    game.addChild(swirl);

    // Add Mail Pilot Label
    var mailPilotLabel = new createjs.Text("Plane Crash", screenFont, constants.LABEL_COLOUR);
    mailPilotLabel.regX = mailPilotLabel.getBounds().width * 0.5;
    mailPilotLabel.regY = mailPilotLabel.getBounds().height * 0.5;
    mailPilotLabel.x = stage.canvas.width * 0.5;
    mailPilotLabel.y = 120;
    game.addChild(mailPilotLabel);

    stage.addChild(game);
}

// init called after Assets have been loaded.
function init() {
    //add play button after loader complete
    playButton = new objects.Button(stage.canvas.width * 0.5, 360, "play");
    game.addChild(playButton);
    currentState = constants.MENU_STATE;

    //Start the game after play button is pressed
    playButton.on("click", function (e) {
        gamePlaying = true;
        changeState(currentState);
    });
}

// Add touch support for mobile devices
function optimizeForMobile() {
    if (window.innerWidth < constants.GAME_WIDTH) {
        stage.canvas.width = 320;
    }
    if (createjs.Touch.isSupported()) {
        createjs.Touch.enable(stage);
    }
    screenScale = stage.canvas.width / constants.GAME_WIDTH;

    stage.update();
}

// Game Loop
function gameLoop(event) {
    if (gamePlaying == true) {
        currentStateFunction();
    } else {
        swirl.rotation -= 0.5;
    }

    stage.update();
}

function changeState(state) {
    switch (state) {
        case constants.MENU_STATE:
            // instantiate menu screen
            currentStateFunction = states.menuState;
            states.menu();
            break;

        case constants.PLAY_STATE:
            // instantiate play screen
            currentStateFunction = states.playState;
            states.play();
            break;

        case constants.GAME_OVER_STATE:
            currentStateFunction = states.gameOverState;

            // instantiate game over screen
            states.gameOver();
            break;

        case constants.INSTRUCTIONS_STATE:
            currentStateFunction = states.instructionState;

            // instantiate game over screen
            states.Instructions();
            break;
    }
}
